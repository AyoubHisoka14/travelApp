import {Collection, Entity, ManyToMany, ManyToOne, Property} from '@mikro-orm/core';
import {BaseEntity} from './BaseEntity';
import { Travel } from './Travel';
import {date, object, string, array} from "yup";

@Entity()
export class TravelDestination extends BaseEntity {

    @Property()
    image?: string;

    @ManyToOne(() => Travel, {nullable:false})
    travel: Travel | undefined ;

    constructor({name, description, startDate, endDate, image}: CreateDestinationDTO) {
        super(name, description, startDate, endDate);
        this.image = image;

    }
}
export const CreateDestinationSchema = object({
    name: string().required(),
    description: string().required(),
    startDate: date().required(),
    endDate: date().required(),

});

export type CreateDestinationDTO = {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    image?: string;

};
