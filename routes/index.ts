import { Router } from "express";
const router = Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  return res.json({ message: `Using environment ${process.env.NODE_ENV}` });
});

export default router;
