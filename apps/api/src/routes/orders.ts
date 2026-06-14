import { Router, type Router as RouterType } from "express";
import { getAll, create, updatePayment } from "../controllers/orders.controller.js";

const router: RouterType = Router();

router.get("/", getAll);
router.post("/", create);
router.patch("/:id/payment", updatePayment);

export default router;
