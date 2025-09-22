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
exports.CreateTravelSchema = exports.Travel = void 0;
const core_1 = require("@mikro-orm/core");
const BaseEntity_1 = require("./BaseEntity");
const TravelDestination_1 = require("./TravelDestination");
const Participant_1 = require("./Participant");
const yup_1 = require("yup");
let Travel = class Travel extends BaseEntity_1.BaseEntity {
    constructor({ name, description, startDate, endDate, image }) {
        super(name, description, startDate, endDate);
        this.travelDestinations = new core_1.Collection(this);
        this.participants = new core_1.Collection(this);
        this.image = image;
    }
};
exports.Travel = Travel;
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], Travel.prototype, "image", void 0);
__decorate([
    (0, core_1.OneToMany)(() => TravelDestination_1.TravelDestination, (e) => e.travel),
    __metadata("design:type", Object)
], Travel.prototype, "travelDestinations", void 0);
__decorate([
    (0, core_1.ManyToMany)(() => Participant_1.Participant),
    __metadata("design:type", Object)
], Travel.prototype, "participants", void 0);
exports.Travel = Travel = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], Travel);
exports.CreateTravelSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().required(),
    description: (0, yup_1.string)().required(),
    startDate: (0, yup_1.date)().required(),
    endDate: (0, yup_1.date)().required(),
});
