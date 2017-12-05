import React, { Component } from "react";
import { observable, action } from "mobx";
import { inject, observer } from "mobx-react";

import Paper from "material-ui/Paper";
import { Tabs, Tab } from "material-ui/Tabs";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import LoginMutation from "../mutations/loginMutation";
import SignupMutation from "../mutations/signupMutation";

function updateAndRedirect(store, relay) {
    setTimeout(relay.refetch, 100, () => {
        store.showIndex();
    });
}

@inject("viewStore")
@observer
export default class AuthForm extends Component {
    render() {
        const { name } = this.props.view;
        const { store } = this.props;
        const { relay } = this.props;
        return (
            <Paper
                zDepth={1}
                style={{
                    height: 275,
                    width: 400,
                    margin: "10% auto 0px auto"
                }}
            >
                <Tabs
                    value={name}
                    onChange={value =>
                        value === "login"
                            ? store.showLogin()
                            : store.showSignup()
                    }
                >
                    <Tab label="Login" value="login">
                        <LoginForm store={this.props.store} relay={relay} />
                    </Tab>
                    <Tab label="Sign Up" value="signup">
                        <SignupForm store={this.props.store} relay={relay} />
                    </Tab>
                </Tabs>
            </Paper>
        );
    }
}

@observer
class LoginForm extends Component {
    @observable loginInput = { username: "", password: "" };

    @action
    updateInput = (name, e) => {
        this.loginInput = { ...this.loginInput, [name]: e.target.value };
    };

    @action
    clearInput() {
        this.loginInput = { username: "", password: "" };
    }

    render() {
        return (
            <div style={{ margin: "0 auto" }}>
                <TextField
                    name="username"
                    label="username"
                    placeholder="Username"
                    value={this.loginInput.username}
                    style={{ display: "block", margin: "20px auto 0" }}
                    onChange={this.updateInput.bind(this, "username")}
                />
                <TextField
                    placeholder="Password"
                    value={this.loginInput.password}
                    style={{ display: "block", margin: "10px auto 0" }}
                    onChange={this.updateInput.bind(this, "password")}
                    label="password"
                    name="password"
                    type="password"
                />
                <RaisedButton
                    label="submit"
                    onClick={e => this.onLogin(e)}
                    style={{
                        display: "block",
                        margin: "25px auto 0",
                        width: "fit-content"
                    }}
                />
            </div>
        );
    }

    onLogin = e => {
        e.preventDefault();
        LoginMutation(
            this.loginInput.username,
            this.loginInput.password,
            viewer => {
                // doesn't work without a timeout... why the fruit not?
                updateAndRedirect(this.props.store, this.props.relay);
            }
        );
        this.clearInput();
    };
}

@observer
class SignupForm extends Component {
    @observable signupInput = { email: "", username: "", password: "" };

    @action
    updateInput = (name, e) => {
        this.signupInput = { ...this.signupInput, [name]: e.target.value };
    };

    @action
    clearInput() {
        this.signupInput = { email: "", username: "", password: "" };
    }

    render() {
        return (
            <div>
                <TextField
                    name="username"
                    label="username"
                    placeholder="Username"
                    style={{ display: "block", margin: "5px auto 0" }}
                    value={this.signupInput.username}
                    onChange={this.updateInput.bind(this, "username")}
                />
                <TextField
                    name="email"
                    label="email"
                    placeholder="Email"
                    style={{ display: "block", margin: "5px auto 0" }}
                    value={this.signupInput.email}
                    onChange={this.updateInput.bind(this, "email")}
                />
                <TextField
                    placeholder="Password"
                    value={this.signupInput.password}
                    onChange={this.updateInput.bind(this, "password")}
                    style={{ display: "block", margin: "5px auto 0" }}
                    label="password"
                    name="password"
                    type="password"
                />
                <RaisedButton
                    label="submit"
                    onClick={e => this.onSignup(e)}
                    style={{
                        display: "block",
                        margin: "10px auto 0",
                        width: "fit-content"
                    }}
                />
            </div>
        );
    }
    onSignup(e) {
        e.preventDefault();
        SignupMutation(
            this.signupInput.email,
            this.signupInput.username,
            this.signupInput.password,
            viewer => {
                updateAndRedirect(this.props.store, this.props.relay);
            }
        );
        this.clearInput();
    }
}
