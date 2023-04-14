import express from "express";
import refreshAuthentication from "../controllers/refreshToken.js";

const router = express.Router();

router.get(`/`, refreshAuthentication);

export default router;
