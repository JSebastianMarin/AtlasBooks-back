import { Router } from "express";
const router = Router();
import { createList, getList } from "../controllers/lists.js";
/*
router.get("/", async (req, res) => {
  res.send({ message: "ruta de las listas" });
});
*/
router.post("/", createList);
router.get("/:id", getList);
router.get("/", getList);
export default router;
