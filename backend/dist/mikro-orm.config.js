"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const Travel_1 = require("./entities/Travel");
const TravelDestination_1 = require("./entities/TravelDestination");
let options;
options = {
    dbName: 'diaryDB',
    debug: true,
    entities: [Travel_1.Travel, TravelDestination_1.TravelDestination],
    password: 'fweSS22',
    driver: postgresql_1.PostgreSqlDriver,
    user: 'diaryDBUser',
};
exports.default = options;
