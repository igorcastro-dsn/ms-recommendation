import 'reflect-metadata';
import { container } from 'tsyringe';
import { RecommendationService } from '../../application/services/RecommendationService';
import { RecommendationRepository } from '../../infrastructure/persistence/mongodb/repositories/RecommendationRepository';
import { Recommendation } from '../../domain/recommendation/entities/Recommendation';
import { ProductRecommendation } from '../../domain/recommendation/entities/ProductRecommendation';
import { OrderRecommendation } from '../../domain/recommendation/entities/OrderRecommendation';
import { OrderItemRecommendation } from '../../domain/recommendation/entities/OrderItemRecommendation';

jest.mock('../../infrastructure/persistence/mongodb/repositories/RecommendationRepository');

describe('RecommendationService', () => {
    
    let recommendationService: RecommendationService;
    let mockRecommendationRepository: jest.Mocked<RecommendationRepository>;

    beforeEach(() => {
        mockRecommendationRepository = new RecommendationRepository() as jest.Mocked<RecommendationRepository>;
        container.registerInstance(RecommendationRepository, mockRecommendationRepository);
        recommendationService = container.resolve(RecommendationService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get recommendations', async () => {
        const productId = 'product123';
        const startDate = new Date('2023-01-01');
        const endDate = new Date('2023-01-31');
        const recommendations = [
            new Recommendation('rec1', 0.8)
        ];

        const productRecommendation = new ProductRecommendation(productId, startDate, endDate, recommendations);
        mockRecommendationRepository.getRecommendations.mockResolvedValue(productRecommendation);

        const result = await recommendationService.getRecommendations(productId, startDate, endDate);

        expect(mockRecommendationRepository.getRecommendations).toHaveBeenCalledWith(productId, startDate, endDate);
        expect(result).toEqual(productRecommendation);
    });

    it('should create a recommendation', async () => {
        const orderId = 'order123';
        const items = [
            new OrderItemRecommendation('product123', '2')
        ];
        const createdAt = new Date();
        const createdRecommendation = new OrderRecommendation(orderId, items, createdAt);

        mockRecommendationRepository.create.mockResolvedValue(createdRecommendation);

        const result = await recommendationService.create(orderId, items, createdAt);

        expect(mockRecommendationRepository.create).toHaveBeenCalledWith(orderId, items, createdAt);
        expect(result).toEqual(createdRecommendation);
    });
  
});
