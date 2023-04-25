import "express-async-errors";
import dotenv from "dotenv";
/* Config */
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import expressRateLimit from "express-rate-limit";

/* Path ES module*/
const { pathname: root } = new URL(`./`, import.meta.url);

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

/* Error handlers imports */
import errorHandlerMiddleware from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

/* Express App */
const app = express();

/* Public files */
// app.use(express.static(`public`));

/* Use Extra Packages */
// app.set(`trust proxy`, 1);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors());
app.use(helmet());
app.use(xss());
app.use(
  expressRateLimit({
    windowMs: 1000 * 60 * 15, // 15 Minutes, 30 requests per IP.
    max: 30,
  })
);

/* Built-in middleware */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Routes */
app.use(`/api`, [authenticationMiddle, recipeRouter]);
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
