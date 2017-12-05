import React from "react";
import { pink500 } from "material-ui/styles/colors";

const styles = {
    width: "45px",
    height: "45px",
    margin: "100px auto",
    borderRadius: "50%",
    animation: "infiSpin 1s ease-in-out infinite",
    border: `3px solid rgba(233, 30, 99,.3)`,
    borderTopColor: "rgb(233, 30, 99)"
};

export const Spinner = () => <div style={styles} />;
