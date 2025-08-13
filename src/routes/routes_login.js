import express from "express";
import { getProfileImage, getProfileInfo, loginUser, UpdatePassword, uploadImages } from "../controlers/controlers_login.js";

const router = express.Router();

router.post("/login", loginUser);

router.get("/user/profile/:userId",getProfileInfo);

router.put("/user/password",UpdatePassword);

router.put("/user/profileImage",uploadImages);

router.get("/user/profileImage/:userId", getProfileImage);

export default router;
