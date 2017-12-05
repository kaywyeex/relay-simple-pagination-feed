import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true // remove whitespace
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

// On creation,
// we will need to encrypt the user password.
// To encrypt the password, we will add salt and hash.
// Adding salt means to add random data to a password, prior to hashing.
UserSchema.pre("save", function(next) {
    const user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

// On authentication,
// we need to compare the submitted pw string with the
// salt & hash version in the database.
// bcrypt.compare hashes the password, and *compares* it with the DB.

UserSchema.statics.authenticate = function(username, password, callback) {
    return User.findOne({ username: username }).exec(function(err, user) {
        if (err) {
            return callback(err);
        } else if (!user) {
            var err = new Error("User not found.");
            err.status = 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, function(err, result) {
            if (result === true) {
                return callback(user); // (null, user)
            } else {
                console.log("woops");
                return callback();
            }
        });
    });
};

const User = mongoose.model("user", UserSchema);
