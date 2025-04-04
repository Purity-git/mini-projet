import { Router } from "express";
import { getUserInfo,login, signup, updateProfile, logout} from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const authRoutes = Router();


authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.post('/update-profile', verifyToken, updateProfile);
authRoutes.post('/logout',logout)
export default authRoutes; 