//react
import React from "react";
import { render } from "react-dom";

// routing
import { Provider } from "mobx-react";
import { startRouter } from "./stores/router";
import * as stores from "./stores";

// relay
import { QueryRenderer } from "react-relay";
import environment from "./Environment";
import ViewerQuery from "./queries/ViewerQuery";

// styles
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { pink500 } from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import App from "./components/App";
import "./styles/index.css";

startRouter({ ...stores });

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: pink500
    }
});

render(
    <MuiThemeProvider muiTheme={muiTheme}>
        <Provider {...stores}>
            <QueryRenderer
                environment={environment}
                query={ViewerQuery}
                variables={{}}
                render={({ error, props }) => {
                    return props ? (
                        <App viewer={props.viewer} />
                    ) : (
                        <div>Loading</div>
                    );
                }}
            />
        </Provider>
    </MuiThemeProvider>,
    document.getElementById("root")
);
