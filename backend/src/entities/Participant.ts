import {Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property} from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { TravelDestination } from './TravelDestination';
import {Travel} from "./Travel";
import {object, string} from "yup";
import { v4 } from 'uuid';

@Entity()
export class Participant {

    @PrimaryKey()
    id: string = v4();

    @PrimaryKey()
    name: string; // Assuming this is a URL or file path to the image

    @Property()
    image?: string

    @ManyToMany(() => Travel, (e) => e.participants)
    travels = new Collection<Travel>(this);

    constructor({name, image}: CreateParticipantDTO) {
        this.name = name;
        this.image = image;

    }
}

export const CreateParticipantSchema = object({
    name: string().required()
});

export type CreateParticipantDTO = {
    name: string;
    image?: string;

};
