import express from "express";
import cors from "cors";
import gemsRouter from "./explore/gems";
import placesRouter from "./explore/places";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/gems", gemsRouter);
app.use("/api/places", placesRouter);

export default app;
