// controllers/sale.controller.ts
import { Request, Response, NextFunction } from 'express';
import Sale from '../models/sale.model';
import Product from '../models/product.model';
import CatchAsyncError from '../middlewares/catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';
import mongoose from 'mongoose';

// ၁။ အရောင်းသွင်းခြင်း
export const createSale = CatchAsyncError(async (req: any, res: Response, next: NextFunction) => {
    const { saleItems, paymentMethod } = req.body;
    let totalAmount = 0;

    for (const item of saleItems) {
        const product = await Product.findById(item.productId);
        if (!product || product.stock < item.quantity) {
            return next(new ErrorHandler(`${product?.name || 'ပစ္စည်း'} လက်ကျန်မလုံလောက်ပါ`, 400));
        }
        totalAmount += item.price * item.quantity;
    }

    const sale = await Sale.create({
        userId: req.user?._id,
        saleItems,
        totalAmount,
        paymentMethod
    });

    for (const item of saleItems) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json({ success: true, data: sale });
});

// ၂။ အရောင်းအားလုံးကြည့်ခြင်း
export const getAllSales = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const sales = await Sale.find()
        .populate("userId", "name email")
        .populate("saleItems.productId", "name price image")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: sales.length, sales });
});

// ၃။ Report ထုတ်ခြင်း
export const getSalesReport = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const report = await Sale.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, totalTransactions: { $sum: 1 } } }
    ]);
    res.status(200).json({
        success: true,
        data: report.length > 0 ? report[0] : { totalRevenue: 0, totalTransactions: 0 }
    });
});

// ၄။ အရောင်းမှတ်တမ်း တစ်ခုချင်းစီကို ID ဖြင့် အသေးစိတ်ကြည့်ခြင်း
export const getSaleById = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    // Accept id from either route params or query to be resilient with frontend calls
    const id = String(req.params.id || req.query.id || "");

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("မမှန်ကန်သော Sale ID ဖြစ်ပါသည်", 400));
    }

    const sale = await Sale.findById(id)
        .populate("userId", "name email")
        .populate("saleItems.productId", "name price image stock");

    if (!sale) {
        return next(new ErrorHandler("အရောင်းမှတ်တမ်းကို ရှာမတွေ့ပါ", 404));
    }

    res.status(200).json({ success: true, data: sale });
});
