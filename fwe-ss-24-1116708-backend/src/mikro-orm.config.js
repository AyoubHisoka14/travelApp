"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const entities_1 = require("./entities");
let options;
options = {
    dbName: 'diaryDB',
    debug: true,
    entities: [entities_1.User],
    password: 'fweSS22',
    driver: postgresql_1.PostgreSqlDriver,
    user: 'diaryDBUser',
};
exports.default = options;
