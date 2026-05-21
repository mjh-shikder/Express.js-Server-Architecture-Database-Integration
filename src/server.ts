import express,{ type Application, type Request, type Response }  from "express"


const app: Application  = express();
const port = 5000;

//*---- Middleware---
app.use(express.json());
app.use(express.text());
//? sudhu urlencoded Nested object recive kore na. O jeno nested data {name:{firstName:A, lastname:B}} o ney ei jonno extended : true dewa hoiche 
app.use(express.urlencoded({extended: true})) 



//* GET Method
app.get("/", (req : Request , res : Response) => {
  // res.send("Express Server");
  res.status(200).json({
    "message": "Express Server",
    "author": "mjh shikder"
  })
});


//* POST Method
app.post('/', async (req : Request, res: Response) => {
  console.log(req.body);
  
})


//?--- Listener ----
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
