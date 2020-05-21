const UserDataAccess = require('../dataaccess/user');
const codeStrings = require('../config/codeStrings');
const {jwt: jwtConfig} = require('../config/secrets');
const {ROLES} = require('../config/enums');
const jwt = require('jsonwebtoken');

class UserApp {
    static async newUser(email, username, password) {
        const user = await UserDataAccess.newUser(ROLES.USER, email, username, password);
        return user.toObject();
    }

    static async getUser(id) {
        const user = await UserDataAccess.getById(id);
        if (!user) {
            throw new Error(codeStrings.USER_NOT_FOUND);
        }
        const {password, ...userWithoutPassword} = user.toObject();
        return userWithoutPassword;
    }

    static async getUsers() {
        const users = await UserDataAccess.getAll();
        return users.map(user => {
            const {password, ...userWithoutPassword} = user.toObject();
            return userWithoutPassword;
        });
    }

    static async authenticate(username, email, password) {
        const user = username
            ? await UserDataAccess.getByUsername(username)
            : await UserDataAccess.getByEmail(email);

        if (!user || !await user.comparePassword(password)) {
            throw new Error(codeStrings.AUTHENTICATION_FAILED);
        }

        const token = jwt.sign({id: user.id, role: user.role}, jwtConfig.secret);
        const {password: _, ...userWithoutPassword} = user.toObject();
        return {
            user: userWithoutPassword,
            token
        };
    }
}

module.exports = UserApp;
