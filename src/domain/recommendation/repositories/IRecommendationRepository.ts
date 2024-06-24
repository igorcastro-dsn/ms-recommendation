
export interface IRecommendationRepository {

    create(orderId: string, items: any[], createdAt: Date): Promise<any>

    getRecommendations(productId: string, startDate: Date, endDate: Date): Promise<any>
  
}
  