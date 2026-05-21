import express,{ type Application, type Request, type Response }  from "express"

import {Pool} from "pg" // eita ekta class


const app: Application  = express();
const port = 5000;


//*---- Middleware---
app.use(express.json());
app.use(express.text());
//? sudhu urlencoded Nested object recive kore na. O jeno nested data {name:{firstName:A, lastname:B}} o ney ei jonno extended : true dewa hoiche 
app.use(express.urlencoded({extended: true})) 


const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:@ep-blue-recipe-aq499ebk-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

//* Database connecting function 
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(20), 
      email VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      
      )
      `);
    
    console.log("Database connected successfully");
    
  } catch (error) {
    console.log(error);
    
  }
}

initDB()

//* GET Method
app.get("/", (req : Request , res : Response) => {
  // res.send("Express Server");
  res.status(200).json({
    "message": "Express Server",
    "author": "mjh shikder"
  })
});


//? Request ta amon chilo Postman er 
// {
//     "name" : "mjh shikder",
//     "email": "mjh@mjhshikder.com",
//     "password": 12345
// }

//* POST Method
app.post('/api/users', async (req : Request, res: Response) => {
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
  
})


//* GET USER ------------
app.get('/api/users', async (req: Request, res: Response) => {
  
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `)
    
    res.status(200).json({
      success: true,
      message: "Users Fetched Successfully",
      data: result.rows
    });


  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }

})
//*--------


//*------ GET SINGLE USER ---------
app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    //? params thika id ta age ber korlam 
    const id = req.params.id
    // console.log(id);
    
    const result = await pool.query(`
      SELECT * FROM users WHERE id=$1
      `, [id]);
    
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
})


//* PUT >> UPDATE USER ------
app.put('/api/users/:id', async (req: Request, res: Response) => {
  
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;

 // console.log(id, name, password, is_active, age);
  try {
    const result = await pool.query(
      `
    UPDATE users 
    SET name=$1, password=$2, age=$3, is_active=$4
    WHERE id= $5
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
    })
  
  }

})



//? --- Listener ---
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
