/**
 * @flow
 * @relayHash 360b6694c005b4e07a9194c21efc5af6
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type ViewerQueryResponse = {|
  +viewer: ?{| |};
|};
*/


/*
query ViewerQuery {
  viewer {
    ...App_viewer
    id
  }
}

fragment App_viewer on User {
  id
  username
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ViewerQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "User",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "App_viewer",
            "args": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "ViewerQuery",
  "query": {
    "argumentDefinitions": [],
    "kind": "Root",
    "name": "ViewerQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "User",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "id",
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "username",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query ViewerQuery {\n  viewer {\n    ...App_viewer\n    id\n  }\n}\n\nfragment App_viewer on User {\n  id\n  username\n}\n"
};

module.exports = batch;
