import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import index_router from "./routes/index";
import auth_router from "./routes/auth.router";

var app = express();

app.use(logger("dev", { skip: () => process.env.NODE_ENV === "test" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", index_router);
app.use("/auth", auth_router);

export default app;
