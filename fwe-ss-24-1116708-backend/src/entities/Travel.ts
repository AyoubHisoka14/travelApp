import {Collection, Entity, ManyToMany, OneToMany, Property} from '@mikro-orm/core';
import {BaseEntity} from './BaseEntity';
import {TravelDestination} from './TravelDestination';
import {Participant} from './Participant';
import {date, object, string, array} from "yup";

@Entity()
export class Travel extends BaseEntity {

    @Property()
    image?: string;

    @OneToMany(() => TravelDestination, (e) => e.travel)
    travelDestinations = new Collection<TravelDestination>(this);

    @ManyToMany(() => Participant)
    participants = new Collection<Participant>(this);

    constructor({name, description, startDate, endDate, image}: CreateTravelDTO) {
        super(name, description, startDate, endDate);
        this.image = image;
    }
}

export const CreateTravelSchema = object({
    name: string().required(),
    description: string().required(),
    startDate: date().required(),
    endDate: date().required(),
    //participants: array().required()
});

export type CreateTravelDTO = {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    image?: string;
    //travelDestinations?: TravelDestination[];
    //participants?: Participant[];
};
