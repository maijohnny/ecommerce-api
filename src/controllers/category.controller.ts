import { Request, Response, NextFunction } from "express";
import Category from "../models/category.model";
// ပြင်ဆင်ချက် - Import ပုံစံကို default import (CatchAsyncError - C အကြီး) ပြောင်းလိုက်ပါသည်
import CatchAsyncError from "../middlewares/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";

// ၁။ Create Category (Admin Only)
export const createCategory = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    const category = await Category.create({
        name,
        description,
    });

    res.status(201).json({
        success: true,
        category,
    });
});

// ၂။ Get All Categories (Admin & Client)
export const getAllCategories = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.find();

    res.status(200).json({
        success: true,
        categories,
    });
});

// ၃။ Update Category (Admin Only)
export const updateCategory = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        category,
    });
});

// ၄။ Delete Category (Admin Only)
export const deleteCategory = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new ErrorHandler("Category not found", 404));
    }

    await category.deleteOne();

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    });
});