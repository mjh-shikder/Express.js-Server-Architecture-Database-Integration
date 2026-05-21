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


//? --- Listener ---
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
