import { pool } from "../../db";
import type { IUser } from "./user.interface";

//* POST Create New User
const createUserIntoDB = async (payload: IUser) => {
    const { name, email, password, age }= payload
     const result = await pool.query(
       `
    INSERT INTO users(name, email, password, age)
    VALUES($1,$2,$3,$4)
    RETURNING *
    `,
       [name, email, password, age],
    );
    return result;
}

//* GET Get All Users 
const getAllUsersFromDB = async () => {
    const result = await pool.query(`
      SELECT * FROM users
      `);
    return result
}


//* GET Single users

const getSingleUserFromDB = async (id: string) => {
    
       
       // console.log(id);

       const result = await pool.query(
         `
      SELECT * FROM users WHERE id=$1
      `,
         [id],
    );
    
    return result
}


//* PUT Update user
const updateUserFromDB = async (payload: IUser, id: string) => {
    
    const { name, password, age, is_active}= payload

    const result = await pool.query(
      `
    UPDATE users 
    SET
    name=COALESCE($1, name),
    password=COALESCE($2, password),
    age=COALESCE($3, age),
    is_active=COALESCE($4, is_active)
    WHERE
    id= $5
    RETURNING *
    `,
      [name, password, age, is_active, id],
    );

    return result
}

//* DELETE User 
const deleteUserFromDB = async (id:string) => {
    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id= $1
      `,
      [id],
    );
    return result
}


//?------EXPORT----------
export const userService = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    updateUserFromDB,
    deleteUserFromDB,
}