import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import schema from './graphql/schema';
import router from './router';
import seed from './seed';
import World from './models/World';

const {
  ENVIRONMENT, HOST, PORT, CLIENT, DB_CONN, DB_NAME,
} = process.env;

const isDev = ENVIRONMENT === 'development';

mongoose.connect(`${DB_CONN}/${DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const db = mongoose.connection;

db.on('error', console.error.bind('console', 'MongoDB connection error:'));

db.once('open', async () => {
  // If they weren't disconnected before we shut down, they are now.
  await World.collection.updateMany({}, { $set: { status: 'disconnected' } });
  // seed();
  const apolloServer = new ApolloServer(
    {
      schema, playground: isDev, introspection: isDev,
    },
  );
  const app = express();
  app.use(cookieParser());
  app.use(cors({ origin: CLIENT, credentials: true }));
  apolloServer.applyMiddleware({ app, cors: { origin: CLIENT, credentials: true } });

  app.use(bodyParser.json());
  app.use('/', router);

  const httpServer = createServer(app);
  apolloServer.installSubscriptionHandlers(httpServer);

  httpServer.listen({ port: PORT }, () => {
    console.log(`Express ready at ${HOST}:${PORT}`);
    console.log(`ApolloServer ready at ${HOST}:${PORT}${apolloServer.graphqlPath}`);
    console.log(`Subscriptions ready at ws://${HOST}:${PORT}${apolloServer.subscriptionsPath}`);
  });

  process.on('exit', () => {
    httpServer.close();
  });
});
