import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env-test") });

import models from "../models";

before(async () => {
  const models_to_clear = ["User"];

  for (let model of models_to_clear) {
    models[model].destroy({ truncate: true });
  }
});
