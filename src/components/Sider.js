import React, { Component } from "react";
import { observer } from "mobx-react";

import Drawer from "material-ui/Drawer";
import MenuItem from "material-ui/MenuItem";

import "./Sider.css";

@observer
export default class Sider extends Component {
    render() {
        return (
            <div>
                <div
                    style={{
                        width: "fit-content",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}
                />
                {/* TODO: toggle only available on sm breakpoint */}
                <Drawer
                    containerClassName={
                        !this.props.observable.open ? "minimized" : "maximized"
                    }
                    containerStyle={{
                        transition:
                            "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"
                    }}
                >
                    <MenuItem style={{ width: "100%" }}>item 1</MenuItem>
                    <MenuItem>item 2</MenuItem>
                    <MenuItem>item 3</MenuItem>
                    <MenuItem>item 4</MenuItem>
                    <MenuItem>item 5</MenuItem>
                </Drawer>
            </div>
        );
    }
}
