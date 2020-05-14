const UserDataAccess = require('../dataaccess/user');
const codeStrings = require('../config/codeStrings');
const {jwt} = require('../config/secrets');

class UserApp {
    static async newUser(email, username, password) {
        return UserDataAccess.newUser(email, username, password);
    }

    static async getUser(id) {
        return UserDataAccess.getById(id);
    }

    static async getUsers() {
        return UserDataAccess.getAll();
    }

    static async authenticate(username, email, password) {
        const user = username
            ? await UserDataAccess.getByUsername(username)
            : await UserDataAccess.getByEmail(email);

        if (!user || !await user.comparePassword(password)) {
            throw new Error(codeStrings.AUTHENTICATION_FAILED);
        }

        const token = jwt.sign({id: user.id, role: user.role}, jwt.secret);
        const {password: _, ...userWithoutPassword} = user;
        return {
            user: userWithoutPassword,
            token
        };
    }
}

module.exports = UserApp;
