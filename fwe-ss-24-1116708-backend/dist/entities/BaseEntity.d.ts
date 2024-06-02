export declare abstract class BaseEntity {
    id: string;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    protected constructor(name: string, description: string, startDate: Date, endDate: Date);
}
export declare const MainSchema: import("yup").ObjectSchema<{
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
