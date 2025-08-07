import express from "express";
import { getProfileInfo, loginUser } from "../controlers/controlers_login.js";

const router = express.Router();

router.post("/login", loginUser);

router.get("/user/profile/:userId",getProfileInfo);

export default router;
