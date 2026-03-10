import mongoose, { Schema, Document } from 'mongoose';

export interface ISaleItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number; // ရောင်းလိုက်တဲ့အချိန်က ဈေးနှုန်း
}

export interface ISale extends Document {
    userId: mongoose.Types.ObjectId;
    saleItems: ISaleItem[];
    totalAmount: number;
    paymentMethod: string;
}

const SaleSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    saleItems: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Kpay', 'Card'], default: 'Cash' }
}, { timestamps: true });

export default mongoose.model<ISale>('Sale', SaleSchema);