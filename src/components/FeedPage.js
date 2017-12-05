import React, { Component } from "react";
import { QueryRenderer, graphql } from "react-relay";
import environment from "../Environment";

import Feed from "./Feed";
import { Spinner } from "./Spinner";

import Paper from "material-ui/Paper";

const LoginRequired = () => (
    <div>
        <Paper
            style={{
                width: "30%",
                height: "30%",
                textAlign: "center",
                margin: "10% auto 0px auto",
                padding: 20
            }}
        >
            You need to login or create an account, before you can view the
            feed.
        </Paper>
    </div>
);

export default class FeedPage extends Component {
    render() {
        return (
            <QueryRenderer
                environment={environment}
                variables={{ count: 20 }}
                query={graphql`
                    query FeedPageQuery($count: Int!, $after: String) {
                        viewer {
                            ...Feed_viewer
                        }
                    }
                `}
                render={({ props, error }) => {
                    // nested conditional. eew. It seems to work tho.
                    return props ? (
                        props.hasOwnProperty("viewer") &&
                        props.viewer !== null ? (
                            <Feed viewer={props.viewer} />
                        ) : (
                            <LoginRequired />
                        )
                    ) : (
                        <Spinner />
                        // <div>Loading...</div>
                    );
                }}
            />
        );
    }
}
