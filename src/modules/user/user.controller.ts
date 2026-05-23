import type { Request, Response } from "express";
import { pool } from "../../db";

const createUser = async (req: Request, res: Response) => {
  //  console.log(req.body);
  // const body = req.body
  const { name, email, password, age } = req.body;

  try {
    const result = await pool.query(
      `
    INSERT INTO users(name, email, password, age)
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,
      [name, email, password, age],
    );

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