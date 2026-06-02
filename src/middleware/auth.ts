import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../config";
import { pool } from "../db";
const auth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
     // console.log("this is protected route");
     //   console.log(req.headers.authorization);
        const token = req.headers.authorization 
        
        if (!token) {
            res.status(401).json({
                sucess: false,
                message: "Unauthorized access!"
            })
        }

        const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload;

       // console.log(decoded);
        
        const userData = await pool.query(`
            SELECT * FROM users WHERE email = $1`, [decoded.email])
        
        
        // now lets dife the user 
        const user = userData.rows[0]
        // console.log(user);
        
        //? ei validation ta ensure korbe jodi user DB theke delete kora hoy er pore o jeno data na dey 
        if (userData.rows.length === 0) {
            res.status(404).json({
              sucess: false,
              message: "User not found!",
            });
        }

        //? user active validation 
        if (!user.is_active) {
            res.status(403).json({
              sucess: false,
              message: "Forbidden access!",
            }); 
        }
        
      next();
    };
}


export default auth