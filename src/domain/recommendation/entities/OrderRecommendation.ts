import { OrderItemRecommendation } from "./OrderItemRecommendation";

export class OrderRecommendation {

    constructor(
        public orderId: string,
        public items: OrderItemRecommendation[],
        public createdAt: Date
    ) {}
}