import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import path from "path";
// import { Updoot } from "./entities/Updoot";

const main = async () => {
  const connection = await createConnection({
    type: "postgres",
    database: "lireddit",
    username: "postgres",
    password: "databasesql",
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User],
  });

  // await connection.runMigrations();

  const app = express();

  const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
  };

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },

      saveUninitialized: false,
      secret: "thisismynewcourse",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],

    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),

    context: ({ req, res }) => ({ req, res, redis }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: corsOptions });

  app.listen(4000, () => console.log("Server runninh on localhost:4000"));
};

main();
