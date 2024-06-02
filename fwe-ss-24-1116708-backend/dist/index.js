"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeServer = exports.DI = void 0;
const express_1 = __importDefault(require("express"));
const core_1 = require("@mikro-orm/core");
const destination_controller_1 = require("./controller/destination.controller");
const participant_controller_1 = require("./controller/participant.controller");
const travel_controller_1 = require("./controller/travel.controller");
const Travel_1 = require("./entities/Travel");
const TravelDestination_1 = require("./entities/TravelDestination");
const Participant_1 = require("./entities/Participant");
const PORT = 3000;
const app = (0, express_1.default)();
exports.DI = {};
const initializeServer = async () => {
    // dependency injection setup
    exports.DI.orm = await core_1.MikroORM.init();
    exports.DI.em = exports.DI.orm.em;
    exports.DI.travelRepository = exports.DI.orm.em.getRepository(Travel_1.Travel);
    exports.DI.destinationRepository = exports.DI.orm.em.getRepository(TravelDestination_1.TravelDestination);
    exports.DI.participantRepository = exports.DI.orm.em.getRepository(Participant_1.Participant);
    // example middleware
    /*
    app.use((req, res, next) => {
        console.info(`New request to ${req.path}`);
        res.send("Welcome B");
        next();
    });
    */
    // global middleware
    app.use(express_1.default.json());
    app.use((req, res, next) => core_1.RequestContext.create(exports.DI.orm.em, next));
    app.use('/uploads', express_1.default.static('src/uploads/'));
    // routes
    app.use('/travels', travel_controller_1.TravelController);
    app.use('/destinations', destination_controller_1.DestinationController);
    app.use('/participants', participant_controller_1.ParticipantController);
    exports.DI.server = app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
};
exports.initializeServer = initializeServer;
if (process.env.environment !== 'test') {
    (0, exports.initializeServer)();
}
