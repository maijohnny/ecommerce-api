import express from "express";
import { 
    createCategory, 
    deleteCategory, 
    getAllCategories, 
    updateCategory 
} from "../controllers/category.controller";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";

const router = express.Router();

// လူတိုင်း ကြည့်လို့ရမယ်
router.route("/").get(getAllCategories);

// Admin ပဲ လုပ်လို့ရမယ်
router.route("/")
    .post(isAuthenticated, authorizeRoles([1, 2]), createCategory);

router.route("/:id")
    .patch(isAuthenticated, authorizeRoles([1, 2]), updateCategory)
    .delete(isAuthenticated, authorizeRoles([2]), deleteCategory);

export default router;