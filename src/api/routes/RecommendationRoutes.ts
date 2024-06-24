import { Router } from 'express';
import { container } from 'tsyringe';
import { RecommendationController } from '../../application/controllers/RecommendationController';

const router = Router();
const recommendationController = container.resolve(RecommendationController);

router.get('/products/:id/recommendations', (req, res) => recommendationController.getRecommendation(req, res));

export default router;
