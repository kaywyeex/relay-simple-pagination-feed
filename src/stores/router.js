import { Router } from "director/build/director";
import { autorun } from "mobx";

export function startRouter(stores) {
    const store = stores.viewStore;

    new Router({
        // routes go here - view change needs to be called as an arrow function
        // to prevent all routes from running on router call
        "/login": () => store.showLogin(),
        "/signup": () => store.showSignup(),
        "/feed": () => store.showFeed(),
        "/": () => store.showIndex()
    })
        .configure({
            notfound: () => store.showIndex(),
            html5history: true
        })
        .init();

    autorun(() => {
        console.log(store.currentPath);
        console.log(store.currentView);
        // get observable path state from viewStore
        const path = store.currentPath;
        // if viewStore path isn't equal to current window pathname,
        // then push new pathname to window
        if (path !== window.location.pathname) {
            window.history.pushState(null, null, path);
        }
    });
}
