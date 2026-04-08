import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  price: number;
  description: string;
  images: string[];
  proofImages: string[];
  status: 'available' | 'sold';
  isFeatured: boolean;
  level: number;
  likes: number;
  createdAt: Date;
}

const ProductSchema: Schema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  images: { type: [String], default: [] },
  proofImages: { type: [String], default: [] },
  status: { type: String, enum: ['available', 'sold'], default: 'available' },
  isFeatured: { type: Boolean, default: false },
  level: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
