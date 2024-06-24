import 'reflect-metadata';
import { container } from 'tsyringe';
import { OrderRepository } from '../persistence/typeorm/repositories/OrderRepository';
import { ProductRepository } from '../persistence/typeorm/repositories/ProductRepository';
import { OrderService } from '../../application/services/OrderService';
import { ProductService } from '../../application/services/ProductService';
import { RecommendationService } from '../../application/services/RecommendationService';
import { RecommendationRepository } from '../persistence/mongodb/repositories/RecommendationRepository';

// Register Injectables
container.register('OrderRepository', { useClass: OrderRepository });
container.register('ProductRepository', { useClass: ProductRepository });
container.register('RecommendationRepository', { useClass: RecommendationRepository });
container.register(OrderService, { useClass: OrderService });
container.register(ProductService, { useClass: ProductService });
container.register(RecommendationService, { useClass: RecommendationService });
