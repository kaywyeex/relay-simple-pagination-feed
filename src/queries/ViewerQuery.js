import { graphql } from "react-relay";

export default graphql`
    query ViewerQuery {
        viewer {
            ...App_viewer
        }
    }
`;
