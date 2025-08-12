import express from "express";
import { getProfileInfo, loginUser, UpdatePassword } from "../controlers/controlers_login.js";

const router = express.Router();

router.post("/login", loginUser);

router.get("/user/profile/:userId",getProfileInfo);

router.put("/user/password",UpdatePassword)

export default router;
