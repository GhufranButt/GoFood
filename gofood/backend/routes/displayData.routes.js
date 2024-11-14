import { Router } from "express";
import { displayData } from "../controllers/displayData.controllers.js";
const router = Router();
router.route("/displayData").post(displayData);
export default router;
