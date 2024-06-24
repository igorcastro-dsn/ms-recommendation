import 'reflect-metadata';
import { Order } from '../../domain/order/entities/Order';
import { OrderService } from '../../application/services/OrderService';
import { MockOrderRepository } from './mocks/MockOrderRepository';
import { MockProductRepository } from './mocks/MockProductRepository';
import { Product } from '../../domain/product/entities/Product';
import AWS from 'aws-sdk';
import { IOrderRepository } from 'domain/order/repositories/IOrderRepository';
import { IProductRepository } from 'domain/product/repositories/IProductRepository';

jest.mock('aws-sdk', () => {
    const mockSendMessage = jest.fn().mockReturnThis();
    const mockPromise = jest.fn();

    const SQS = {
        sendMessage: mockSendMessage,
        promise: mockPromise,
    };

    return {
        SQS: jest.fn(() => SQS),
    };
});

const mockSqs = new AWS.SQS();

describe('OrderService', () => {
    let orderService: OrderService;
    let mockOrderRepository: MockOrderRepository;
    let mockProductRepository: MockProductRepository;

    beforeEach(() => {
        mockOrderRepository = new MockOrderRepository();
        mockProductRepository = new MockProductRepository();

        orderService = new OrderService(
            mockOrderRepository as IOrderRepository,
            mockProductRepository as IProductRepository,
        );

        (orderService as any).sqs = mockSqs; 
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create an order', async () => {
        const productA = new Product('SKU-123', 'Product A', 100.0);
        const productB = new Product('SKU-456', 'Product B', 200.0);
        await mockProductRepository.create(productA);
        await mockProductRepository.create(productB);

        jest.spyOn(mockOrderRepository, 'create').mockImplementation(async (order) => order);
        jest.spyOn(mockProductRepository, 'findByIds').mockImplementation(async (ids: string[]) => 
            ids.map(id => {
                const dummyProduct = new Product('SKU-DUMMY', 'Dummy Product', 100.0);
                dummyProduct.setId(id)
                return dummyProduct;
            })
        );

        const items = [
            { productId: productA.getId(), quantity: 2 },
            { productId: productB.getId(), quantity: 1 },
        ];

        await orderService.createOrder(items); // função testada

        expect(mockOrderRepository.create).toHaveBeenCalledTimes(1);
        expect(mockProductRepository.findByIds).toHaveBeenCalledTimes(1);
        expect(mockSqs.sendMessage).toHaveBeenCalledTimes(1); 

        const sendMessageParams: AWS.SQS.SendMessageRequest = (mockSqs.sendMessage as jest.Mock).mock.calls[0][0];
        const { MessageBody, QueueUrl } = sendMessageParams;
        const parsedMessageBody = JSON.parse(MessageBody);

        const createdOrder = (mockOrderRepository.create as jest.Mock).mock.calls[0][0] as Order;
        expect(parsedMessageBody.orderId).toEqual(createdOrder.getId());
        expect(parsedMessageBody.items).toEqual(createdOrder.getItems());
        expect(parsedMessageBody.createdAt).toEqual(createdOrder.getCreatedAt().toISOString());
        expect(QueueUrl).toEqual(`${process.env.AWS_HOST}/000000000000/${process.env.SQS_ORDER_CREATED_QUEUE}`);
    });
});
