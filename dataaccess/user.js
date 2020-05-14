const User = require('../models/user');

class UserDataAccess {
    static async getById(id) {
        return User.findOne({id});
    }

    static async newUser(email, username, password) {
        const newUser = new User({email, username, password});
        await newUser.save();
        return newUser;
    }

    static async getAll() {
        return User.find({});
    }

    static async getByUsername(username) {
        return User.findOne({username});
    }

    static async getByEmail(email) {
        return User.findOne({email});
    }
}

module.exports = UserDataAccess;
