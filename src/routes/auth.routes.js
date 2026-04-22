import express from "express";
const router = express.Router();
import { login, register, getUser } from "../controllers/auth.controllers.js";


router.post("/login",login)
router.post("/register",register)
router.get("/users/:userId", getUser)  // For Orders Service to fetch user details



export default router;
