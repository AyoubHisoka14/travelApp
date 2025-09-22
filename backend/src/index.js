"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeServer = exports.DI = void 0;
const express_1 = __importDefault(require("express"));
const core_1 = require("@mikro-orm/core");
const auth_controller_1 = require("./controller/auth.controller");
const diaryEntry_controller_1 = require("./controller/diaryEntry.controller");
const tag_controller_1 = require("./controller/tag.controller");
const entities_1 = require("./entities");
const auth_middleware_1 = require("./middleware/auth.middleware");
const PORT = 3000;
const app = (0, express_1.default)();
exports.DI = {};
const initializeServer = () => __awaiter(void 0, void 0, void 0, function* () {
    // dependency injection setup
    exports.DI.orm = yield core_1.MikroORM.init();
    exports.DI.em = exports.DI.orm.em;
    exports.DI.diaryEntryRepository = exports.DI.orm.em.getRepository(entities_1.DiaryEntry);
    exports.DI.diaryEntryTagRepository = exports.DI.orm.em.getRepository(entities_1.DiaryEntryTag);
    exports.DI.userRepository = exports.DI.orm.em.getRepository(entities_1.User);
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
    app.use(auth_middleware_1.Auth.prepareAuthentication);
    // routes
    app.use('/auth', auth_controller_1.AuthController);
    app.use('/diaryEntries', auth_middleware_1.Auth.verifyAccess, diaryEntry_controller_1.DiaryController);
    app.use('/tags', auth_middleware_1.Auth.verifyAccess, tag_controller_1.TagController);
    exports.DI.server = app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
});
exports.initializeServer = initializeServer;
if (process.env.environment !== 'test') {
    (0, exports.initializeServer)();
}
