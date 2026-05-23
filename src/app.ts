import express, {
  type Application,
  type Request,
  type Response,
} from "express";


import { pool } from "./db";
import { userRoute } from "./modules/user/user.route";

const app: Application = express();


//*---- Middleware---
app.use(express.json());
app.use(express.text());
//? sudhu urlencoded Nested object recive kore na. O jeno nested data {name:{firstName:A, lastname:B}} o ney ei jonno extended : true dewa hoiche
app.use(express.urlencoded({ extended: true }));



//* GET Method
app.get("/", (req: Request, res: Response) => {
  // res.send("Express Server");
  res.status(200).json({
    message: "Express Server",
    author: "mjh shikder",
  });
});

//? Request ta amon chilo Postman er
// {
//     "name" : "mjh shikder",
//     "email": "mjh@mjhshikder.com",
//     "password": 12345
// }

//? connection to router POST Method
app.use('/api/users', userRoute)




//* GET USER ------------
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `);

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
});
//*--------

//*------ GET SINGLE USER ---------
app.get("/api/users/:id", async (req: Request, res: Response) => {
  try {
    //? params thika id ta age ber korlam
    const id = req.params.id;
    // console.log(id);

    const result = await pool.query(
      `
      SELECT * FROM users WHERE id=$1
      `,
      [id],
    );

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
});

//* PUT >> UPDATE USER ------
app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;

  // console.log(id, name, password, is_active, age);
  try {
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
});

//*------>>------ DELETE MEthod ----->>-----
app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id= $1
      `,
      [id],
    );

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
});


export default app

