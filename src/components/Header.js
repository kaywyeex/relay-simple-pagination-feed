import React, { Component } from "react";
import { action } from "mobx";
import { observer, inject } from "mobx-react";

import LogoutMutation from "../mutations/logoutMutation";

import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";

import "./Header.css";

const Logged = ({ relay }) => (
    <IconMenu
        iconButtonElement={
            <IconButton>
                <MoreVertIcon />
            </IconButton>
        }
        iconStyle={{ color: "white" }}
        targetOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "center" }}
    >
        <MenuItem
            primaryText="Sign out"
            onClick={() =>
                LogoutMutation(() => {
                    console.log(relay);
                    console.log("success");
                    relay.refetch();
                })
            }
        />
    </IconMenu>
);

@inject("viewStore")
@observer
export default class Header extends Component {
    @action
    toggleSider = () => {
        this.props.observable.open = !this.props.observable.open;
    };

    render() {
        const { open } = this.props.observable;
        const { relay } = this.props;
        const { viewStore } = this.props;
        return (
            <div>
                {/* TODO: Breakpoint margin class*/}
                <AppBar
                    onLeftIconButtonTouchTap={this.toggleSider}
                    // No sider -- if you want the drawer, set menuIconButton to true
                    showMenuIconButton={false}
                    title="Feed"
                    className="header"
                    // style={
                    //     !open ? { marginLeft: "48px" } : { marginLeft: "256px" }
                    // }
                    titleStyle={{
                        marginLeft: 15,
                        textTransform: "UPPERCASE",
                        fontSize: 18,
                        height: "48px",
                        lineHeight: "48px"
                    }}
                    iconStyleRight={{
                        marginRight: "10px!important",
                        marginTop: "auto",
                        marginBottom: "auto"
                    }}
                    iconElementRight={
                        viewStore.currentUser ? (
                            <div
                                style={{
                                    display: "flex"
                                }}
                            >
                                <div
                                    style={{
                                        display: "inline-block",
                                        color: "#fff",
                                        lineHeight: "48px",
                                        textTransform: "UPPERCASE",
                                        fontSize: 14,
                                        fontWeight: 400,
                                        height: 48
                                    }}
                                >
                                    {viewStore.currentUser.username}
                                </div>
                                <Logged relay={relay} />
                            </div>
                        ) : (
                            <FlatButton
                                label="Login"
                                onClick={() => viewStore.showLogin()}
                            />
                        )
                    }
                />
            </div>
        );
    }
}
