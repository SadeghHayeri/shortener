class Random {
    static generateRandomString() {
        return Math.random().toString(36).substr(2, 10);
    }
}

module.exports = Random;
