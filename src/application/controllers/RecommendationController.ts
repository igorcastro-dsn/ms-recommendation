import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import logger from '../../infrastructure/config/logger-config';
import { RecommendationService } from '../../application/services/RecommendationService';

@injectable()
export class RecommendationController {

  constructor(
    @inject(RecommendationService) private recommendationService: RecommendationService
  ) {}

  async getRecommendation(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { startDate, endDate } = req.query;
    logger.info(`Getting recommendations for product=${id}, startDate=${startDate}, endDate=${endDate}`);

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Params startDate and endDate are required' });
      return;
    }

    const startDateObj = new Date(startDate.toString());
    const endDateObj = new Date(endDate.toString());

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      res.status(400).json({ error: 'Invalid format for params startDate or endDate. Use YYYY-MM-DD) format' });
      return;
    }

    const recommendations = await this.recommendationService.getRecommendations(id, startDateObj, endDateObj);
    res.status(200).send(recommendations);
  }

}
