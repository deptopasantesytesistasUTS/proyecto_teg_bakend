import express from "express";
import { loginUser } from "../controlers/controlers_login.js";

const router = express.Router();

router.post("/login", loginUser);

export default router;
