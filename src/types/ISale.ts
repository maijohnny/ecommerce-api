import { Document, Schema } from "mongoose";

export interface ISaleItem {
    productId: Schema.Types.ObjectId;
    quantity: number;
    price: number; // ရောင်းလိုက်တဲ့အချိန်က ဈေးနှုန်း (Price snapshot)
}

export interface ISale extends Document {
    userId: Schema.Types.ObjectId; // ဘယ်သူရောင်းတာလဲ
    saleItems: ISaleItem[];
    totalAmount: number;
    paymentMethod: "Cash" | "Kpay" | "Card";
    createdAt: Date;
}