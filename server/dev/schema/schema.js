import {
    GraphQLBoolean,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString
} from "graphql";

import {
    connectionArgs,
    connectionDefinitions,
    connectionFromArray,
    cursorForObjectInConnection,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions,
    toGlobalId
} from "graphql-relay";

import { signup, login } from "../services/auth";
import {
    getUser,
    getUsers,
    getViewer,
    getPost,
    getHackernews
} from "./database";

// get node interface and field from relay lib

// nodeInterface defines the way you resolve an ID to it's matching object(search DB by ID)
// nodeField defines the way you resolve a node object to it's matching GraphQL type(match case)
// nodeDefinitions methods that map node ID back to the correct database object which you can then return
const { nodeInterface, nodeField } = nodeDefinitions(
    globalId => {
        const { type, id } = fromGlobalId(globalId);
        console.log("===NODEFIELD POST ID===");
        console.log(type, id);
        switch (type) {
            case "User":
                return getUser(id);
            case "Post":
                return getPost(id);
            default:
                console.log("===NODEFIELD DEFAULT===");
                return null;
        }
        // resolve globalId to db match
    },
    obj => {
        console.log("===NODEFIELD OBJ.SOURCE===");
        switch (true) {
            case obj.hasOwnProperty("username"):
                return userType;
            case obj.hasOwnProperty("source"):
                console.log(obj);
                return postType;
            default:
                console.log("===NODE OBJ FIELD DEFAULT===");
                return null;
        }
    }
);

const postType = new GraphQLObjectType({
    name: "Post",
    description: "Post fetched from an external source",
    fields: () => ({
        id: globalIdField("Post"),
        postId: {
            type: GraphQLString,
            resolve: post => post.id
        },
        source: { type: GraphQLString },
        author: {
            type: GraphQLString,
            resolve: post => post.by
        },
        title: { type: GraphQLString },
        content: { type: GraphQLString, resolve: post => post.text },
        link: { type: GraphQLString, resolve: post => post.url },
        time: { type: GraphQLString }
    }),
    interfaces: [nodeInterface]
});

// define a connection between an object and it's children (eg. a user and it's todos)
// connectionType has an edges field which contains cursor and a todo node

const {
    connectionType: postConnection, // Name/Call the connection
    edgeType: PostEdge // Name the edge
} = connectionDefinitions({ name: "Post", nodeType: postType }); // Name connection ande node + select node

// user type
const userType = new GraphQLObjectType({
    name: "User",
    description: "A registered user of the application",
    fields: () => ({
        id: globalIdField("User"),
        userId: {
            type: GraphQLString,
            description: "id of user in db",
            resolve: user => user._id
        },
        email: {
            type: GraphQLString,
            description: "email of user"
        },
        username: {
            type: GraphQLString,
            description: "username of user in db"
        },
        posts: {
            type: postConnection,
            description: "Posts listed under the user",
            args: connectionArgs,
            resolve: async (root, args) =>
                connectionFromArray(await getHackernews(), args)
        }
    }),
    interfaces: [nodeInterface]
});

// root query type
// schema entry point
const Query = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        viewer: {
            type: userType,
            resolve: (root, args) => getViewer(root, args)
        },
        post: {
            type: postType,
            args: {
                postId: {
                    type: GraphQLID
                }
            },
            resolve: (root, { postId }) => getPost(postId)
        },
        posts: {
            type: new GraphQLList(postType),
            resolve: async (root, args) => {
                const posts = await getHackernews();
                return posts;
            }
        },
        node: nodeField,
        users: {
            type: new GraphQLList(userType),
            resolve: async (root, args) => {
                const users = await getUsers();
                return users;
            }
        }
    })
});

const signupMutation = mutationWithClientMutationId({
    name: "Signup",
    inputFields: {
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    outputFields: {
        viewer: {
            type: userType,
            resolve: ({ userId }) => getUser(userId)
        }
    },
    mutateAndGetPayload: async function({ email, username, password }, req) {
        const newUser = await signup(email, username, password, req);
        return {
            userId: newUser._id
        };
    }
});

const loginMutation = mutationWithClientMutationId({
    name: "Login",
    inputFields: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    outputFields: {
        viewer: {
            type: userType,
            resolve: ({ userId }) => getUser(userId)
        },
        userId: {
            type: GraphQLID,
            // userId from payload
            resolve: ({ userId }) => userId
        }
    },
    mutateAndGetPayload: async function({ username, password }, req) {
        const newUser = await login(username, password, req);
        return {
            userId: newUser._id
        };
    }
});

// root mutation type
// entry point for performing writes into schema
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    description: "...", // optional
    fields: () => ({
        // pass all mutations here
        signup: signupMutation,
        login: loginMutation,
        logout: {
            type: userType,
            resolve: (root, args, req) => {
                req.session.destroy(err => {
                    if (err) {
                        return err;
                    }
                    return "logout success";
                });
            }
        }
    })
});

export const schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});
