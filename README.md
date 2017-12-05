Showcase of relay/graphql pagination usage with a simple login restrictions.
Scrolling to the bottom triggers `loadMore()`.

The project was made with RethinkDB storing the posts, and mongodb for users.
RethinkDB enables automatic subscription to pushed changes, rather than polling
for updates. This allows for effortless work in with the QueryRenderer.

#### Viewing feed requires login

![Alt text](/img/screenshot1.png?raw=true "Title")

#### Feed View

![Alt text](/img/screenshot2.png?raw=true "Title")

#### Scrolling to the bottom triggers `loadMore()` pagination

![Alt text](/img/screenshot3.png?raw=true "Title")

<br>
<hr>
<br>

## **mw-starter**

This is an ejected CRA template, with a custom express and graphql+relay server
using custom webpack dev+hot middleware. It also includes support for
decorators, along with async/await syntax. Mobx, Director and Material Ui comes
preinstalled.
