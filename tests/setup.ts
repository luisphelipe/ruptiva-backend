import path from "path";
import dotenv from "dotenv";
let test_env = process.env.NODE_ENV || "test";
console.log("env before", process.env.NODE_ENV);
dotenv.config({ path: path.resolve(process.cwd(), `.env-${test_env}`) });
console.log("env after", process.env.NODE_ENV);

import models from "../models";

before(async () => {
  const models_to_clear = ["User"];

  for (let model of models_to_clear) {
    models[model].destroy({ truncate: { associations: true } });
  }
});
