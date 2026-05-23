import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";

//? POST 
const createUser = async (req: Request, res: Response) => {
  //  console.log(req.body);
  // const body = req.body
 // const { name, email, password, age } = req.body;

  try {
   
const result = await userService.createUserIntoDB(req.body)
    // console.log(result);

    res.status(201).json({
      message: "User Created Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Email Already Exists",
      Error: error,
    });
  }
};


export const userController = {
    createUser,

}