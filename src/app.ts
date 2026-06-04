import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRouter } from "./modules/auth/auth.route";
import fs from "fs"
import logger from "./middleware/logger";
import CookieParser from "cookie-parser"
import cors from "cors"
import globalErrorHanlder from "./middleware/globalErrorHandler";
const app: Application = express();

//*---- Middleware---
app.use(express.json());
app.use(express.text());
//? sudhu urlencoded Nested object recive kore na. O jeno nested data {name:{firstName:A, lastname:B}} o ney ei jonno extended : true dewa hoiche
app.use(express.urlencoded({ extended: true }));
app.use(logger)

app.use(CookieParser())


app.use(cors({ origin: "http://localhost:3000" }));

//* Root Route
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

//? All Method with router
app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRouter)

//* Global error Handling middleware
app.use(globalErrorHanlder)

export default app;
