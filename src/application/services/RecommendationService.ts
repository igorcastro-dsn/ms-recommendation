import { inject, injectable } from 'tsyringe';
import { RecommendationRepository } from '../../infrastructure/persistence/mongodb/repositories/RecommendationRepository';
import { ProductRecommendation } from '../../domain/recommendation/entities/ProductRecommendation';

@injectable()
export class RecommendationService {
  
  constructor(
    @inject(RecommendationRepository) private recommendationRepository: RecommendationRepository
  ) {}

  async getRecommendations(productId: string, startDate: Date, endDate: Date): Promise<ProductRecommendation> {
    return await this.recommendationRepository.getRecommendations(productId, startDate, endDate);
  }

  async create(orderId: string, items: any[], createdAt: Date): Promise<any> {
    return await this.recommendationRepository.create(orderId, items, createdAt);
  }

}
