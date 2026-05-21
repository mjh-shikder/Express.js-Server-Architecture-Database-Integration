import express,{ type Application, type Request, type Response }  from "express"


const app: Application  = express();
const port = 5000;

app.get("/", (req : Request , res : Response) => {
  // res.send("Express Server");
  res.status(200).json({
    "message": "Express Server",
    "author": "mjh shikder"
  })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
