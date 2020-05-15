class Collections {
    static objectToMap(object) {
        return new Map(Object.entries(object));
    }

    static mapToObject(map) {
        const object = {};
        map.forEach((value, key) => {
            object[key] = value;
        });
        return object;
    }
}

module.exports = Collections;
