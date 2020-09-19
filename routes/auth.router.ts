import { Router } from "express";
import auth_controller from "../controllers/auth.controller";

const router = Router();

router.post("/signup", auth_controller.signup);

export default router;
