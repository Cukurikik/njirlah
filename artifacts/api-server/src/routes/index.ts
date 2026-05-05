import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cloudflareRouter from "./cloudflare";
import openrouterRouter from "./openrouter";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cloudflareRouter);
router.use(openrouterRouter);

export default router;
