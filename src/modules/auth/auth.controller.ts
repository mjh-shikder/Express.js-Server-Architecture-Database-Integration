import type { Request, Response } from "express"
import { authService } from "./auth.service";


const loginUser = async (req: Request, res: Response) => {
    try {
        
      const result = await authService.loginUserIntoDB(req.body) // service er funciton ke call dici from auth.service.ts
      
      const { refreshToken } = result
      
      res.cookie("refreshToken", refreshToken, {
        secure: false, // in production => true
        httpOnly: true,
        sameSite: "lax"
      })
        
        res.status(201).json({
          success: true,
          message: "User Login Successfully",
          data: result
        });
    } catch (error: any) {
         res.status(500).json({
           success: false,
           message: error.message,
           data: {},
         });
    }
}


const refreshToken = async (req: Request, res: Response) => {

  try {
    const result = await authService.generateRefreshToken(req.cookies.refreshToken); // service er funciton ke call dici from auth.service.ts

 

    res.status(201).json({
      success: true,
      message: "Access Token Generated",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {},
    });
  }
  

};


export const authController = {
  loginUser,
  refreshToken
}