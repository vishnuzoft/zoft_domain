import Ajv from 'ajv';
import AjvFormats from 'ajv-formats';
import cors from 'cors';
import * as dotenv from 'dotenv';
import express from 'express';
import http from 'http';

import { environment } from './config';
import { errorHandler } from './middlewares/errorHandler';
import { V1 } from './routes';
import {
  compileSchema,
} from './utility';


dotenv.config();
const ajv = new Ajv();
AjvFormats(ajv);
const validator = compileSchema();

const app = express();
const newServer = http.createServer(app);
const PORT: any =
  process.env.NODE_ENV === "development" ? 3000 : environment.PORT;
const IP_ADDRESS = environment.IP_ADDRESS;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    methods: ["*"],
  })
);

app.use("/public", express.static("public"));

app.use("/api", V1);

app.use(errorHandler);

const server = newServer.listen(PORT,0.0.0.0,() => {
  console.log(`server is running on the port http://${IP_ADDRESS}:${PORT}`);
});
