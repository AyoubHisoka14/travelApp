import { Collection } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { TravelDestination } from './TravelDestination';
import { Participant } from './Participant';
export declare class Travel extends BaseEntity {
    image?: string;
    travelDestinations: Collection<TravelDestination, object>;
    participants: Collection<Participant, object>;
    constructor({ name, description, startDate, endDate, image }: CreateTravelDTO);
}
export declare const CreateTravelSchema: import("yup").ObjectSchema<{
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
}, import("yup").AnyObject, {
    name: undefined;
    description: undefined;
    startDate: undefined;
    endDate: undefined;
}, "">;
export type CreateTravelDTO = {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    image?: string;
};
