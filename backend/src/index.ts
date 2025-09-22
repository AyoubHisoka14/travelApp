import express from 'express';
import http from 'http';

import { EntityManager, EntityRepository, MikroORM, RequestContext } from '@mikro-orm/core';

import { DestinationController } from './controller/destination.controller';
import { ParticipantController } from './controller/participant.controller';
import { TravelController } from './controller/travel.controller';
import {Travel} from "./entities/Travel";
import {TravelDestination} from "./entities/TravelDestination";
import {Participant} from "./entities/Participant";
import path from "path";
import {CurrencyController} from "./controller/currency.controller";

const PORT = 3000;
const app = express();

export const DI = {} as {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    travelRepository: EntityRepository<Travel>;
    destinationRepository: EntityRepository<TravelDestination>;
    participantRepository: EntityRepository<Participant>;
};

export const initializeServer = async () => {
    // dependency injection setup
    DI.orm = await MikroORM.init();
    DI.em = DI.orm.em;
    DI.travelRepository = DI.orm.em.getRepository(Travel);
    DI.destinationRepository = DI.orm.em.getRepository(TravelDestination);
    DI.participantRepository = DI.orm.em.getRepository(Participant);


    // global middleware
    app.use(express.json());
    app.use((req, res, next) => RequestContext.create(DI.orm.em, next));

    app.use('/uploads', express.static('src/uploads/'));
    // routes
    app.use('/currency', CurrencyController);
    app.use('/travels', TravelController);
    app.use('/destinations', DestinationController);
    app.use('/participants', ParticipantController, );

    DI.server = app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
};

if (process.env.environment !== 'test') {
    initializeServer();
}
