import express from "express";
import logout from "../controllers/logout.js";

const router = express.Router();

router.route(`/`).get(logout);

export default router;
