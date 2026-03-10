import { Request, Response } from 'express';
import Sale from '../models/sale.model';
import Product from '../models/product.model';
import Category from '../models/category.model'; // Category model ကိုပါ import လုပ်ပါ

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // ၁။ စုစုပေါင်း ပစ္စည်းအရေအတွက် နှင့် Category အရေအတွက်
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments(); // ပုံထဲက Category list အရေအတွက်အတွက်

        // ၂။ စုစုပေါင်း ရောင်းရငွေ (Total Sales Amount)
        const totalSales = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$totalAmount" }
                }
            }
        ]);

        // ၃။ လအလိုက် အရောင်းပမာဏ (Monthly Sales Chart အတွက်)
        const monthlySales = await Sale.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$totalAmount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // ၄။ ရောင်းအားအကောင်းဆုံး ပစ္စည်း ၁၀ မျိုး
        const topProducts = await Sale.aggregate([
            { $unwind: "$saleItems" },
            {
                $group: {
                    _id: "$saleItems.productId",
                    totalSold: { $sum: "$saleItems.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" } // ပစ္စည်းအမည် တိုက်ရိုက်ယူလို့ရအောင်
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                totalCategories, // ဒီမှာ ထပ်တိုးထားပါတယ်
                totalSalesAmount: totalSales[0]?.totalAmount || 0, // စုစုပေါင်းရောင်းရငွေ
                monthlySales,
                topProducts
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};