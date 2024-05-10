

import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';

import 'express-async-errors';


import EnvVars from '@src/constants/EnvVars';

import { NodeEnvs } from '@src/constants/misc';
import { createExpressEndpoints } from '@ts-rest/express';
import { contract } from './routes/contracts';
import rpcRouter from './routes/FileRoutes';

import { generateOpenApi } from '@ts-rest/open-api';
import swaggerUi from 'swagger-ui-express';


// **** Variables **** //

const app = express();


// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  const status = 400;
  return res.status(status).json({ error: err.message });
});



createExpressEndpoints(contract, rpcRouter, app);
const openApiDocument = generateOpenApi(contract, {
  info: {
    title: 'Zeptolab API',
    version: '1.0.0',
  },
});

app.get('/', (_: Request, res: Response) => {
  return res.redirect('/docs');
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

export default app;
