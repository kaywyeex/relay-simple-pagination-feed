// server
import path from "path";
import * as fs from "fs";
import express from "express";
import bodyParser from "body-parser";

// logger
import winston from "winston";

// mongodb
import mongoose from "mongoose";
import session from "express-session";
import connectMongo from "connect-mongo";
import { User } from "./models/user";

// rethinkdb
import r from "rethinkdb";
import { fetchHackernews } from "./posts/hackernews";

// graphql
import graphQLHttp from "express-graphql";
import { schema } from "./schema/schema";

// webpack
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import config from "../../config/webpack.config.dev";

const isDeveloping = process.env.NODE_ENV !== "production";
const server = express();

// logger
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" })
    ]
});

if (process.env.NODE_ENV !== "production") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple()
        })
    );
}
export { logger };

// rethinkdb
let conn;
r.connect({ host: "localhost", port: 28015 }, (err, connection) => {
    if (err) console.log(err);
    conn = connection;
    // fetchHackernews(conn);
});

// mongodb
const MongoStore = connectMongo(session);
const DB = "mongodb://localhost:27017";
// mLab - mongodb://root:root@ds121726.mlab.com:21726/devread
mongoose.Promise = global.Promise;

mongoose.connect(DB, { useMongoClient: true });
mongoose.connection
    .once("open", () => console.log("mLab connect successful!"))
    .on("error", err => logger.error(err));

// express-session -- encrypted session Id on user cookie
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.set("trust proxy", 1);
server.use(
    session({
        secret: "devread secret is safe with me",
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            url: DB,
            autoReconnect: true
        }),
        cookie: {
            path: "/",
            maxAge: 1800000 //30 mins
        }
    })
);
// graphql
server.use(
    "/graphql",
    graphQLHttp(request => ({
        schema,
        rootValue: { session: request.session },
        graphiql: true
    }))
);

if (isDeveloping) {
    const compiler = webpack(config);
    const devMiddleware = webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: { colors: true }
    });
    const hotMiddleware = webpackHotMiddleware(compiler, {
        log: console.log,
        path: "/__webpack_hmr",
        heartbeat: 10 * 1000
    });

    server.use(devMiddleware);
    server.use(hotMiddleware);

    server.use("*", function(req, res, next) {
        const filename = path.join(compiler.outputPath, "index.html");
        compiler.outputFileSystem.readFile(filename, function(err, result) {
            if (err) {
                return next(err);
            }
            res.set("content-type", "text/html");
            res.send(result);
            res.end();
        });
    });
} else {
    server.use(express.static(path.join(__dirname, "..", "..", "/build/")));
    server.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "..", "..", "/build/index.html"));
    });
}

export default server;
