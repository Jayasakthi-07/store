import mongoose, { Schema, Document } from 'mongoose';

export interface IProof extends Document {
  imageUrl: string;
  createdAt: Date;
}

const ProofSchema: Schema = new Schema({
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Proof || mongoose.model<IProof>('Proof', ProofSchema);
