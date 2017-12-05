import { observable, computed, action, useStrict } from "mobx";

useStrict(true);

class ViewStore {
    @observable currentView = null;
    @observable currentUser = null;

    @computed
    get isAuthenticated() {
        return !!this.currentUser;
    }

    @computed
    get currentPath() {
        switch (this.currentView.name) {
            case "index":
                return "/";
            case "login":
                return "/login";
            case "signup":
                return "/signup";
            case "feed":
                return "/feed";
            default:
                return "/";
        }
    }

    @action
    showIndex() {
        this.currentView = {
            name: "index"
        };
    }

    @action
    showLogin() {
        this.currentView = {
            name: "login"
        };
    }

    @action
    showSignup() {
        this.currentView = {
            name: "signup"
        };
    }

    @action
    showFeed() {
        this.currentView = {
            name: "feed"
        };
    }
}

// exporting all stores as singletons
const viewStore = new ViewStore();
export default viewStore;
