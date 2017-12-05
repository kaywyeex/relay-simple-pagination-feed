import { commitMutation, graphql } from "react-relay";
import environment from "../Environment";

const mutation = graphql`
    mutation loginMutation($input: LoginInput!) {
        login(input: $input) {
            viewer {
                userId
                username
                email
            }
        }
    }
`;

export default (username, password, callback) => {
    const variables = {
        input: {
            username,
            password
        }
    };
    commitMutation(environment, {
        mutation,
        variables,
        onCompleted: (result, err) => {
            if (err) console.log(err);
            callback(result.login.viewer);
        },
        onError: err => console.error(err)
    });
};
