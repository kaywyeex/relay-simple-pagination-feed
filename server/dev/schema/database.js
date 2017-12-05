import r from "rethinkdb";
import mongoose from "mongoose";
const User = mongoose.model("user");

// VIEWER
export function getViewer(root, args) {
    const _id = root.session.userId;
    return User.findById(_id, (err, user) => {
        return user;
    });
}

// USER
export function getUser(id) {
    return User.findById(id, (err, user) => {
        return err, user;
    });
}

export function getUsers() {
    return User.find({});
}

// POSTS
export async function getPost(id) {
    const conn = await r.connect(
        await { host: "localhost", port: 28015 },
        (err, connection) => {
            if (err) console.log(err);
        }
    );

    const data = await r
        .db("devread")
        .table("hackernews")
        .get(parseInt(id))
        .run(conn);

    const post = await data;

    return await post;
}

export async function getHackernews() {
    const conn = await r.connect(
        await { host: "localhost", port: 28015 },
        (err, connection) => {
            if (err) console.log(err);
        }
    );
    const data = await r
        .db("devread")
        .table("hackernews")
        .run(conn, (err, res) => {
            if (err) console.log(err);
            return res;
        });

    const posts = data.toArray();

    return await posts;
}
