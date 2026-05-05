import { Router, type IRouter } from "express";
import healthRouter from "./health";
import cloudflareRouter from "./cloudflare";
import openrouterRouter from "./openrouter";
import replitRouter from "./replit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(cloudflareRouter);
router.use(openrouterRouter);
router.use(replitRouter);

export default router;
