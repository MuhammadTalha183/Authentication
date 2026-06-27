import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js";
const authRouter = Router();


authRouter.post("/register", registerUser);

export default authRouter;