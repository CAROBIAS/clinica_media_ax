import express from "express";
import cors from "cors";
import morgan from "morgan";

import obrasRoutes from "./routes/obrasSociales.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", obrasRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Servidor corriendo en puerto 3000");
});
