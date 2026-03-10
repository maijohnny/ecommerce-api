import { Request, Response, NextFunction } from 'express';
import Product from '../models/product.model';
import CatchAsyncError from '../middlewares/catchAsyncError';
import ErrorHandler from '../utils/ErrorHandler';

// ၁။ ပစ္စည်းအသစ်ထည့်ခြင်း
export const createProduct = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
});

// ၂။ ပစ္စည်းအားလုံးကို ပြန်ကြည့်ခြင်း
export const getProducts = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { categoryId, search } = req.query;
    let query: any = {};
    if (categoryId) query.categoryId = categoryId;
    if (search) query.name = { $regex: search, $options: 'i' };

    const products = await Product.find(query).populate('categoryId', 'name');
    res.status(200).json({ success: true, products });
});

// ၃။ ပစ္စည်းအချက်အလက် ပြင်ဆင်ခြင်း (Update)
export const updateProduct = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, data: product });
});

// ၄။ ပစ္စည်းဖျက်ခြင်း (Delete)
export const deleteProduct = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product deleted successfully" });
});