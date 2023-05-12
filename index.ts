import express, { Express } from 'express';
import cors from "cors";
import { GroupRouter, UserRouter, AuthRouter } from './routers';
import {Group, User, UserGroup} from './models';
import { sequelize } from './data-access';
import {logger} from './loggers';
import {apiLogger, errorMethods, morganMiddleware, checkTokenAccess} from './middlewares';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8080;

export const server: Express = express();

const corsOptions = {
  origin: `http://localhost:${PORT}`,
  methods: 'GET, PUT, POST, DELETE',
  optionsSuccessStatus: 200,
};

server.use(express.urlencoded({
  extended: false
  }
));
server.use(cors(corsOptions));
server.use(apiLogger);
server.use(express.json());
server.use(morganMiddleware);
server.use('/', AuthRouter);
server.use('/', checkTokenAccess, UserRouter);
server.use('/', checkTokenAccess, GroupRouter);
server.use(errorMethods);


process
  .on('UncaughtException', (error) => {
    logger.error(`${error} : uncaught exception thrown`);
    process.exit(1);
  })
  .on('UnhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  });

const startServer = async () => {
  await sequelize.authenticate();
  await User.sync();
  await Group.sync();
  await UserGroup.sync();
};

startServer()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server started at http://localhost:${PORT}`)
    })
  })
  .catch((err) => logger.error(err));
