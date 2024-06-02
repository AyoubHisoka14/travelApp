/// <reference types="node" />
import http from 'http';
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import { Travel } from "./entities/Travel";
import { TravelDestination } from "./entities/TravelDestination";
import { Participant } from "./entities/Participant";
export declare const DI: {
    server: http.Server;
    orm: MikroORM;
    em: EntityManager;
    travelRepository: EntityRepository<Travel>;
    destinationRepository: EntityRepository<TravelDestination>;
    participantRepository: EntityRepository<Participant>;
};
export declare const initializeServer: () => Promise<void>;
