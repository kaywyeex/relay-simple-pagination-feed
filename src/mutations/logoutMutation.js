import { commitMutation, graphql } from "react-relay";
import environment from "../Environment";

const mutation = graphql`
    mutation logoutMutation {
        logout {
            userId
        }
    }
`;

export default callback => {
    commitMutation(environment, {
        mutation,
        onCompleted: (result, err) => {
            console.log("Logout success!");
            callback(result);
        },
        onError: err => console.error(err)
    });
};
