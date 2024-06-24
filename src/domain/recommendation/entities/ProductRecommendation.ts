import { Entity } from "../../../domain/Entity";
import { Recommendation } from "./Recommendation";

export class ProductRecommendation extends Entity {
    
    constructor(
        productId: string,
        public startDate: Date,
        public endDate: Date,
        public recommendations: Recommendation[]
    ) {
        super();
        this.setId(productId);
    }
    
}