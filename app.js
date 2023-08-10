import dotenv from "dotenv";
import "express-async-errors";
/* Config */
dotenv.config();

import path from "node:path";
import fs from "fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import expressRateLimit from "express-rate-limit";
import multer from "multer";

/* Import Routes */
import recipeRouter from "./routes/recipes.js";
import userAuth from "./routes/userAuth.js";
import authenticationMiddle from "./middleware/authentication.js";
import refreshAuthentication from "./controllers/refreshToken.js";
import logout from "./routes/logout.js";

/* Cookie Parser */
import cookieParser from "cookie-parser";

/* Database connection */
import connectDB from "./db/connect.js";

/* CORS allow cross site origin */
import credentials from "./middleware/credentials.js";

/* CORS options */
import corsOptions from "./config/corsOptions.js";

/* Error handlers imports */
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

/* Express App */
const app = express();

/* Credentials to allow for fetching cookies. Must be before CORS */
app.use(credentials);

/* Set up path directory manually since I'm using ESModules */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Use Extra Packages */
// app.use(
//   path.join(__dirname, "/Images"),
//   express.static(path.join(__dirname, "/Images"))
// );
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(helmet());
app.use(xss());
app.use(
  expressRateLimit({
    windowMs: 1000 * 60 * 15, // 15 Minutes, 30 requests per IP.
    max: 100,
  })
);

/* Built-in middleware */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Multer Setup. For managing file uploads */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), "/Images")),
  filename: (req, file, cb) => {
    const ext =
      path.extname(file.originalname) || `.${file.mimetype.split("/")[1]}`;
    return cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

/* Routes */
app.use(`/recipes`, [
  authenticationMiddle,
  upload.single(`image`),
  recipeRouter,
]);
app.use(`/auth`, userAuth);
app.use(`/refresh_token`, refreshAuthentication);
app.use(`/logout`, logout);

app.get(`/`, (req, res) => {
  res.status(200).json({ msg: `Welcome to the Book of Recipes API` });
});

/* Error handling middleware */
app.use(notFound);
app.use(errorHandlerMiddleware);

/* Port */
const PORT = process.env.PORT || 3000;

const start = (async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();
