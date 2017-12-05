import mongoose from "mongoose";

const User = mongoose.model("user");

// signUp
export async function signup(email, username, password, req) {
    const user = await new User({ email, username, password });

    if (!email || !password) {
        throw new Error("Enter an email and password");
    }
    // check if user already exists
    const userExists = await User.findOne({ email });
    req.session.userId = user._id;
    const newUser = userExists ? "Email already in use!" : await user.save();
    return newUser;
}

// login
export async function login(username, password, req) {
    const foundUser = await User.authenticate(
        username,
        password,
        async (user, err) => {
            if (err) console.log(err);
            req.session.userId = await user._id;
            return req.session.save(err => {
                if (err) console.log(err);
                return user;
            });
        }
    );

    return foundUser;
}

// logout
export function logout({ req }) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if (err) {
                return err;
            } else {
                // return res.redirect("/");
            }
        });
    }
}
