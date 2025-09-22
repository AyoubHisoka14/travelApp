import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import {Travel} from "./entities/Travel";
import {TravelDestination} from "./entities/TravelDestination";


let options: Options;
options = {
    dbName: 'diaryDB',
    debug: true,
    entities: [Travel, TravelDestination],
    password: 'fweSS22',
    driver: PostgreSqlDriver,
    user: 'diaryDBUser',
};

export default options;
