import { commitMutation, graphql } from "react-relay";
import environment from "../Environment";

const mutation = graphql`
    mutation signupMutation($input: SignupInput!) {
        signup(input: $input) {
            viewer {
                userId
                username
                email
            }
        }
    }
`;

export default (email, username, password, callback) => {
    const variables = {
        input: {
            email,
            username,
            password
        }
    };
    commitMutation(environment, {
        mutation,
        variables,
        onCompleted: (result, err) => {
            callback(result.signup.viewer);
        },
        onError: err => console.error(err)
    });
};
