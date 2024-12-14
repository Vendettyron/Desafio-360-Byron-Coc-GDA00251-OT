import express from "express";
import productRoutes from "./routes/productos.routes.js";
import { getConnection } from "./database/DbConection.js";

const app = express();
getConnection();
app.use(express.json());
app.use(productRoutes);

// app.get("/api", (req, res) => {
//   res.json({ prueba: ["hola", "mundo", "desde", "express"] });
// });

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
