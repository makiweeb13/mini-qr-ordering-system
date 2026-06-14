import { Router, type Router as RouterType } from "express";
import { getAll } from "../controllers/products.controller.js";

const router: RouterType = Router();

router.get("/", getAll);

export default router;
