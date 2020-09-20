import path from "path";
import dotenv from "dotenv";
let test_env = process.env.NODE_ENV || "test";
dotenv.config({ path: path.resolve(process.cwd(), `.env-${test_env}`) });

import models from "../models";

before(async () => {
  const models_to_clear = ["User"];

  for (let model of models_to_clear) {
    models[model].destroy({ truncate: { associations: true } });
  }
});
