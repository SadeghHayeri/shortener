const User = require('../models/user');
const codeStrings = require('../config/codeStrings');

class UserDataAccess {
    static async newUser(role, email, username, password) {
        try {
            const newUser = new User({role, email, username, password});
            await newUser.save();
            return newUser.toObject();
        } catch (error) {
            if (error.code === 11000) {
                throw new Error(codeStrings.USERNAME_OR_EMAIL_ALREADY_EXIST);
            }
            throw error;
        }
    }

    static async getAll() {
        return User.find({});
    }

    static async getById(id) {
        return User.findOne({_id: id});
    }

    static async getByUsername(username) {
        return User.findOne({username});
    }

    static async getByEmail(email) {
        return User.findOne({email});
    }
}

module.exports = UserDataAccess;
