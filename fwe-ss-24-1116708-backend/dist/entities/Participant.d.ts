import { Collection } from '@mikro-orm/core';
import { Travel } from "./Travel";
export declare class Participant {
    id: string;
    name: string;
    image?: string;
    travels: Collection<Travel, object>;
    constructor({ name, image }: CreateParticipantDTO);
}
export declare const CreateParticipantSchema: import("yup").ObjectSchema<{
    name: string;
}, import("yup").AnyObject, {
    name: undefined;
}, "">;
export type CreateParticipantDTO = {
    name: string;
    image?: string;
};
