import { Router } from "express";
import { authController } from "./auth.controller";


const router = Router()

export const authRouter = router


router.post('/login', authController.loginUser )