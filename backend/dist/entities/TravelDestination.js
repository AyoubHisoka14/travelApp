"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDestinationSchema = exports.TravelDestination = void 0;
const core_1 = require("@mikro-orm/core");
const BaseEntity_1 = require("./BaseEntity");
const Travel_1 = require("./Travel");
const yup_1 = require("yup");
let TravelDestination = class TravelDestination extends BaseEntity_1.BaseEntity {
    constructor({ name, description, startDate, endDate, image }) {
        super(name, description, startDate, endDate);
        this.image = image;
    }
};
exports.TravelDestination = TravelDestination;
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], TravelDestination.prototype, "image", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => Travel_1.Travel, { nullable: false }),
    __metadata("design:type", Object)
], TravelDestination.prototype, "travel", void 0);
exports.TravelDestination = TravelDestination = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], TravelDestination);
exports.CreateDestinationSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().required(),
    description: (0, yup_1.string)().required(),
    startDate: (0, yup_1.date)().required(),
    endDate: (0, yup_1.date)().required(),
});
