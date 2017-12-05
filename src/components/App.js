import React, { Component } from "react";
import { observable, action } from "mobx";
import { observer, inject } from "mobx-react";

import { createRefetchContainer, graphql } from "react-relay";
import ViewerQuery from "../queries/ViewerQuery";

import Header from "./Header";
import Sider from "./Sider";
import AuthForm from "./AuthForm";
import FeedPage from "./FeedPage";

import "./App.css";

@inject("viewStore")
@observer
class App extends Component {
    @observable siderState = { open: false };

    @action
    setCurrentUser(viewer) {
        this.props.viewStore.currentUser = viewer;
    }

    render() {
        this.setCurrentUser(this.props.viewer);
        return (
            <div>
                <Header observable={this.siderState} relay={this.props.relay} />
                {/* Didn't need sider */}
                {/* <Sider observable={this.siderState} /> */}
                <div
                    className="content"
                    // style={
                    //     !this.siderState.open
                    //         ? { marginLeft: "48px" }
                    //         : { marginLeft: "256px" }
                    // }
                >
                    {renderCurrentView(this.props.viewStore, this.props.relay)}
                </div>
            </div>
        );
    }
}

function renderCurrentView(store, relay) {
    const view = store.currentView;
    switch (view.name) {
        case "index":
            return <FeedPage view={view} store={store} relay={relay} />;
        case "login":
        case "signup":
            return <AuthForm view={view} store={store} relay={relay} />;
        default:
            return <FeedPage view={view} store={store} relay={relay} />;
    }
}

export default createRefetchContainer(
    App,
    {
        viewer: graphql`
            fragment App_viewer on User {
                id
                username
            }
        `
    },
    ViewerQuery
);
