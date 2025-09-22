
import { v4 } from 'uuid';

import { PrimaryKey, Property } from '@mikro-orm/core';
import {object, string, date} from "yup";

export abstract class BaseEntity {
    @PrimaryKey()
    id: string = v4();

    @PrimaryKey()
    name: string;

    @Property()
    description: string;

    @Property()
    startDate: Date;

    @Property()
    endDate: Date;


    protected constructor(name: string, description: string, startDate: Date, endDate: Date) {
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

export const MainSchema = object({
    name: string().required(),
    description: string().required(),
    startDate: date().required(),
    endDate: date().required()
});

