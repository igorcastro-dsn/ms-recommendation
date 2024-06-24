import { Schema, model, Document, Model } from 'mongoose';

interface IOrderItem {
  productId: string;
  id: string;
}

interface IOrderDocument extends Document {
  orderId: string;
  items: IOrderItem[];
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  id: { type: String, required: true }
});

const OrderSchema = new Schema<IOrderDocument>({
  orderId: { type: String, required: true },
  items: { type: [OrderItemSchema], required: true },
  createdAt: { type: Date, required: true, default: Date.now }
});

const OrderModel: Model<IOrderDocument> = model<IOrderDocument>('Order', OrderSchema);

export { IOrderDocument, OrderModel };