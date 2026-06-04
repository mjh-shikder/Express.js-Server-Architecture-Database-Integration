import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

//? POST
const createUser = async (req: Request, res: Response) => {
  //  console.log(req.body);
  // const body = req.body
  // const { name, email, password, age } = req.body;

  try {
    const result = await userService.createUserIntoDB(req.body);
    // console.log(result);

    sendResponse(res, {
      message: "User Created Successfully",
      data: result.rows[0],
      statusCode: 201,
      success: true
    });
    

  } catch (error: any) {
    sendResponse(res, {
      message: "Email Already Exists",
      error: error,
      statusCode: 500,
      success: false,

    });
    res.status(500).json();
  }
};

//? GET ALL USERS
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsersFromDB();

    res.status(200).json({
      success: true,
      message: "Users Fetched Successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

//? GET Single User
const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
   
 
    const result = await userService.getSingleUserFromDB(id as string)

    //  console.log(result);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User Retrived Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};


//? PUT Update user
const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    
const result = await userService.updateUserFromDB(req.body, id as string)
    // console.log(result);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
      data: {},
    });
  }
};

//! Make sure always use `await` when calling function from userService

//? DELETE User
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    
    const result = await userService.deleteUserFromDB(id as string)

    console.log(result);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
      data: {},
    });
  }
};





//?-----EXPORT---------
export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
