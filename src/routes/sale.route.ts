import express from "express";
import { 
    createSale, 
    getAllSales,
    getSalesReport,
    getSaleById,
} from "../controllers/sale.controller";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";

const router = express.Router();

/**
 * ၁။ ပစ္စည်းရောင်းချခြင်း (Staff ရော Admin ပါ လုပ်နိုင်သည်)
 * POST: /api/v1/sales/
 */
router.route("/").post(isAuthenticated, createSale);

/**
 * ၂။ အရောင်းစာရင်းအားလုံး ပြန်ကြည့်ခြင်း (Staff နှင့် Admin နှစ်မျိုးလုံး ကြည့်နိုင်ရန်)
 * GET: /api/v1/sales/all
 */
router.route("/all").get(isAuthenticated, getAllSales);

/**
 * ၃။ Dashboard Report ကြည့်ခြင်း (Admin သာ ကြည့်ခွင့်ပေးခြင်း)
 * GET: /api/v1/sales/report
 */
router.route("/report").get(
    isAuthenticated, 
    authorizeRoles([1,2]), // သင်၏ Role က 1 သို့မဟုတ် "admin" ဖြစ်ပါက ထိုအတိုင်းပြောင်းပါ
    getSalesReport
);

/**
 * ၄။ အရောင်းမှတ်တမ်း တစ်ခုချင်းစီကို ID ဖြင့် အသေးစိတ်ကြည့်ခြင်း
 * GET: /api/v1/sales/single/:id
 */
router.route("/single/:id").get(isAuthenticated, getSaleById);

export default router;
