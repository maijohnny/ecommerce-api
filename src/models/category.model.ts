import mongoose, { Schema } from 'mongoose';
import { ICategory } from '../types/ICategory';

const CategorySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
}, { timestamps: true });

export default mongoose.model<ICategory>('Category', CategorySchema);