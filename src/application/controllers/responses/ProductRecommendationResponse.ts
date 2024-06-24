
import { Entity } from "../../../domain/Entity";
import { Recommendation } from "../../../domain/recommendation/entities/Recommendation";

export class ProductRecommendationResponse extends Entity {
    
    constructor(
        productId: string,
        public startDate: string,
        public endDate: string,
        public recommendations: Recommendation[]
    ) {
        super();
        this.setId(productId);
    }
    
}