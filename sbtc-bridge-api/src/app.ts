import { dumpConfig, sbtcContractId, host, port } from './lib/config.js';
import { swagger } from './lib/swagger.js'
import express, { Application } from "express";
import morgan from "morgan";
import Router from "./routes/index.js";
import { serve, setup } from 'swagger-ui-express';
import { sbtcEventJob } from './controllers/JobScheduler.js';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("public"));
app.use(cors());

app.use(
  "/bridge-api/docs",
  serve,
  setup(undefined, {
    swaggerOptions: {
      spec: swagger
      //url: "/swagger.json",
    },
  })
);

app.use(Router);

app.listen(port, () => {
  dumpConfig();
  console.log(`Express is listening at http://localhost:${port} \nwallet: ${sbtcContractId}`);
  return;
});

sbtcEventJob.start();
console.log(`Running on ${host}:${port}\n\n`);
