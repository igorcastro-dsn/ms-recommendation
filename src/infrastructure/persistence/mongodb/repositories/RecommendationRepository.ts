import { injectable } from 'tsyringe';
import { IOrderDocument, OrderModel } from '../models/OrderModel';
import { IRecommendationRepository } from 'domain/recommendation/repositories/IRecommendationRepository';
import { OrderItem } from 'domain/order/entities/OrderItem';
import { DateUtils } from '../../../../infrastructure/utils/DateUtils';
import { ProductRecommendation } from '../../../../domain/recommendation/entities/ProductRecommendation';
import { OrderRecommendation } from '../../../../domain/recommendation/entities/OrderRecommendation';
import { OrderItemRecommendation } from '../../../../domain/recommendation/entities/OrderItemRecommendation';

@injectable()
export class RecommendationRepository implements IRecommendationRepository {

  private model = OrderModel;

  async getRecommendations(productId: string, startDate: Date, endDate: Date): Promise<ProductRecommendation> {
    
    const recommendations = await this.model.aggregate([
      
      // Filtra apenas os pedidos que contém o produto base, e dentro de um período desejado (desconsiderando a hora)
      { $match:  
        { 
          "items.productId": productId, 
          createdAt: { 
            $gte: DateUtils.toUtcDateOnly(startDate), 
            $lte: DateUtils.toUtcDateOnly(endDate)
          }
        } 
      },  

      // Desfaz o campo de items e gera um documento para cada item
      { $unwind: "$items" }, 

      // Filtra os produtos relacionados removendo o produto base
      { $match: { "items.productId": { $ne: productId } } }, 

      // Agrupa por cada item e conta as ocorrências
      { $group: { _id: "$items.productId", count: { $sum: 1 } } }, 

      // Totaliza os counts (referência total para score) e armazena os resultados anteriores em um array chamado products.
      { $group: { _id: null, total: { $sum: "$count" }, products: { $push: { productId: "$_id", count: "$count" } } } }, 

      // Desfaz o campo de products e gera um documento para cada product
      { $unwind: "$products" },

      // Calcula o score dividindo o count de cada produto pelo total calculado anteriormente. O resultado é arredondado para 2 casas decimais.
      { $project: { _id: 0, productId: "$products.productId", score: { $round: [{ $divide: ["$products.count", "$total"] }, 2]} } },

      // Ordena os resultados pelo score (ordem decrescente)
      { $sort: { score: -1 } }, 

      // Limita os resultados a 5 recomendações
      { $limit: 5 } 
    ]).exec();

    return new ProductRecommendation(productId, startDate, endDate, recommendations);
  }

  async create(orderId: string, items: OrderItem[], createdAt: Date): Promise<OrderRecommendation> {
    const orderDocument = await this.model.create({ orderId, items, createdAt: DateUtils.toUtcDateOnly(createdAt)});
    return this.toDomain(orderDocument);
  }

  private toDomain(orderDocument: IOrderDocument): OrderRecommendation {
    const items = orderDocument.items.map(item => new OrderItemRecommendation(item.productId, item.id));
    return new OrderRecommendation(orderDocument.orderId, items, orderDocument.createdAt);
  }
  
}
