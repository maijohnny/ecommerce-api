import express, { NextFunction, Request, Response } from "express";
import "dotenv/config";
import cors from "cors";
import { ErrorMiddleware } from "./middlewares/error";
import connectDB from "./config/db";
import rateLimit from "express-rate-limit";

// --- Route Imports (ဒီနေရာမှာ အသစ်တွေ ထပ်ထည့်ပါ) ---
import userRouter from "./routes/user.route";
import categoryRouter from "./routes/category.route"; // New
import productRouter from "./routes/product.route";   // New
import saleRouter from "./routes/sale.route";         // New

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
});

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(cors({ origin: "*" }));
app.use(limiter);

const port = process.env.PORT || 3000;
const dbUrl = process.env.DB_URL || "";

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("<h1>Ecommerce Api is working...</h1>");
});

// --- API Routes Registration ---
app.use('/users', userRouter);
app.use('/categories', categoryRouter); // Category Route ချိတ်ခြင်း
app.use('/products', productRouter);     // Product Route ချိတ်ခြင်း
app.use('/sales', saleRouter);           // Sale/Reports Route ချိတ်ခြင်း

// 404 handler (Route မရှိရင် ပြမယ့် error)
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} is not found!`,
    })
});

// Server Listen
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDB(dbUrl);
});

// Error Middleware ကို အောက်ဆုံးမှာ ထားရပါမယ်
app.use(ErrorMiddleware);