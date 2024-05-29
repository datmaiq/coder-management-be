import morgan from 'morgan';
import helmet from 'helmet';
import express from 'express';

import 'express-async-errors';

import BaseRouter from '@src/routes/api';


import {connectDB} from "@src/db/db";
import * as process from "process";


const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Show routes called in console during development
if (process.env.ENV === "development") {
  app.use(morgan('dev'));
}

// Security
if (process.env.ENV === "production") {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use("/api", BaseRouter);

connectDB().catch((_) => {
  process.exit(1)
});


// **** Export default **** //

export default app;
