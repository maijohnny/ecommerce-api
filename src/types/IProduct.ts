import { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    stock: number;
    categoryId: Schema.Types.ObjectId; // Category model နဲ့ ချိတ်ရန်
    barcode: string;
    images?: {
        public_id: string;
        url: string;
    }[];
    createdAt: Date;
    updatedAt: Date;
}