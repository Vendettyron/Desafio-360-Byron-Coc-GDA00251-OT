import express from "express";
import {
  getProducts,
  getIdProducts,
  postProducts,
  putProducts,
  deleteProducts,
} from "../controllers/products.controllers.js";

const router = express.Router();

router.get("/productos", getProducts);

router.get("/productos/:id", getIdProducts);

router.post("/productos", postProducts);

router.put("/productos/:id", putProducts);

router.delete("/productos/:id", deleteProducts);

export default router;
