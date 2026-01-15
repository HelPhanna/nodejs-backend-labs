// Import Express framework
import express from "express";

// Import from controller
import { register, login, logout } from "../controllers/authController.js";

const router = express.Router();

// routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
