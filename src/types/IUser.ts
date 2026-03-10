import { Document } from "mongoose";

// Role တွေကို နံပါတ်နဲ့ မှတ်ရတာ ရှုပ်နိုင်လို့ Enum သုံးတာ ပိုကောင်းပါတယ်
export enum UserRole {
    USER = 0,
    STAFF = 1,
    ADMIN = 2,
    ROOT_ADMIN = 3
}

export interface IUser extends Document {
    name: string;
    email: string;
    phone?: string;
    password: string;
    avatar?: string; // Image URL
    role: UserRole;   // number (0, 1, 2, 3)
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    
    // JWT Token ထုတ်ပေးမည့် Method
    signAccessToken(): string; // Promise ဖြစ်ချင်မှဖြစ်မှာမို့ string လို့ပဲ ထားကြည့်ပါ
    
    // Password စစ်ဆေးမည့် Method
    comparePassword(enteredPassword: string): Promise<boolean>;
}