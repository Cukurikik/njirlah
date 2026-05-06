import { Router, type IRouter } from "express";
import healthRouter from "./health";
import chatRouter from "./chat";
import statusRouter from "./status";
import cloudflareRouter from "./cloudflare";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statusRouter);
router.use(cloudflareRouter);
router.use(chatRouter);

export default router;
