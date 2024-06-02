import { BaseEntity } from './BaseEntity';
import { Travel } from './Travel';
export declare class TravelDestination extends BaseEntity {
    image?: string;
    travel: Travel | undefined;
    constructor({ name, description, startDate, endDate, image }: CreateDestinationDTO);
}
export declare const CreateDestinationSchema: import("yup").ObjectSchema<{
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
export type CreateDestinationDTO = {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    image?: string;
};
