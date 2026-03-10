import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    stock: number;
    categoryId: mongoose.Types.ObjectId;
    barcode: string;
}

const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    barcode: { type: String, unique: true }
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', ProductSchema);