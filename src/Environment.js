// basic
// bundles config, cache and network.
import { Environment, Network, RecordSource, Store } from "relay-runtime";

// network
async function fetchQuery(operation, variables, cacheConfig, uploadables) {
    const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: "devread secret is safe with me"
        },
        body: JSON.stringify({
            query: operation.text,
            variables
        })
    });
    return response.json();
}

const network = Network.create(fetchQuery);
const source = new RecordSource();
const store = new Store(source);
// const handlerProvider = null;

export default new Environment({
    // handlerprovider,
    network,
    store
});
