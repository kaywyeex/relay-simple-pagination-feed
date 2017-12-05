import React, { Component } from "react";
import {
    createFragmentContainer,
    createPaginationContainer,
    graphql
} from "react-relay";

import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import FlatButton from "material-ui/FlatButton";
import { Table, TableBody, TableRow, TableRowColumn } from "material-ui/Table";
import { pink500 } from "material-ui/styles/colors";

import { PAGINATION_COUNT } from "../constants";

class Feed extends Component {
    componentDidMount() {
        window.addEventListener("scroll", this._handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this._handleScroll);
    }

    _handleScroll = () => {
        const windowHeight =
            "innerHeight" in window
                ? window.innerHeight
                : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight) {
            console.log("at bottom");
            this._loadMore();
        }
    };

    render() {
        return (
            <div>
                <Table selectable={false}>
                    <TableBody displayRowCheckbox={false}>
                        {this.props.viewer.posts.edges.map((node, index) => {
                            {
                                const post = node.node;
                                return (
                                    <TableRow key={post.postId}>
                                        <TableRowColumn
                                            style={{ width: "85%" }}
                                        >
                                            {post.title}
                                        </TableRowColumn>
                                        <TableRowColumn
                                            style={{ width: "15%" }}
                                        >
                                            <FlatButton
                                                fullWidth={true}
                                                href={post.link}
                                                secondary={true}
                                                label={"Read More"}
                                                labelStyle={{ fontSize: 10 }}
                                            />
                                        </TableRowColumn>
                                    </TableRow>
                                );
                            }
                        })}
                    </TableBody>
                </Table>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <FloatingActionButton
                        mini={true}
                        onClick={() => this._loadMore()}
                        // style={{ marginTop: "-15px" }}
                        className="load-more"
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                </div>
            </div>
        );
    }

    _redirect(url) {
        window.location.replace(null, null, url);
        console.log(window.location);
    }

    _loadMore() {
        if (!this.props.relay.hasMore()) {
            console.log(`Nothing more to load`);
            return;
        } else if (this.props.relay.isLoading()) {
            console.log(`Request is already pending`);
            return;
        }

        this.props.relay.loadMore(10);
    }
}

export default createPaginationContainer(
    Feed,
    {
        viewer: graphql`
            fragment Feed_viewer on User {
                posts(first: $count, after: $after)
                    @connection(key: "Feed_posts") {
                    edges {
                        node {
                            postId
                            source
                            title
                            author
                            link
                        }
                    }
                    pageInfo {
                        hasNextPage
                        endCursor
                    }
                }
            }
        `
    },
    {
        direction: "forward",
        query: graphql`
            query FeedPaginationQuery($count: Int!, $after: String) {
                viewer {
                    ...Feed_viewer
                }
            }
        `,
        getConnectionFromProps(props) {
            return props.viewer && props.viewer.posts;
        },
        getFragmentVariables(previousVariables, totalCount) {
            return {
                ...previousVariables,
                count: totalCount
            };
        },
        getVariables(props, paginationInfo, fragmentVariables) {
            return {
                count: paginationInfo.count,
                after: paginationInfo.cursor
            };
        }
    }
);
