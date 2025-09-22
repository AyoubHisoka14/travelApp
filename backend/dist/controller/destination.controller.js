"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestinationController = void 0;
const express_1 = require("express");
const index_1 = require("../index");
const TravelDestination_1 = require("../entities/TravelDestination");
const core_1 = require("@mikro-orm/core");
const travel_controller_1 = require("./travel.controller");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const destinations = await index_1.DI.destinationRepository.findAll();
    res.status(200).send(destinations);
});
router.get('/:id', async (req, res) => {
    const destination = await index_1.DI.destinationRepository.findOne({ id: req.params.id }, {
        populate: ['travel'],
    });
    res.status(200).send(destination);
});
router.post('/:id', travel_controller_1.upload.single('image'), async (req, res) => {
    const validatedData = await TravelDestination_1.CreateDestinationSchema.validate(req.body).catch((e) => {
        res.status(400).json({ errors: e.errors });
    });
    if (!validatedData) {
        return;
    }
    const createDestinationDTO = {
        ...validatedData,
        image: req.file ? `/uploads/${req.file.filename}` : undefined
    };
    const destination = new TravelDestination_1.TravelDestination(createDestinationDTO);
    const travel = await index_1.DI.travelRepository.findOne({ id: req.params.id });
    (0, core_1.wrap)(destination).assign({ travel: travel }, { em: index_1.DI.em });
    await index_1.DI.em.persistAndFlush(destination);
    await index_1.DI.destinationRepository.populate(destination, ['travel']);
    res.status(201).send(destination);
});
router.put('/:id', travel_controller_1.upload.single('image'), async (req, res) => {
    try {
        const destination = await index_1.DI.destinationRepository.findOne({ id: req.params.id }, {
            populate: ['travel'],
        });
        if (!destination) {
            return res.status(404).send({ message: 'Destination not found' });
        }
        (0, core_1.wrap)(destination).assign(req.body);
        if (req.file) {
            destination.image = `/uploads/${req.file.filename}`;
        }
        await index_1.DI.em.flush();
        //res.json(destination);
        res.status(201).send(destination);
    }
    catch (e) {
        return res.status(400).send({ errors: [e.message] });
    }
});
router.delete('/:id', async (req, res) => {
    // diary Entry laden
    const destination = await index_1.DI.destinationRepository.findOne({ id: req.params.id
    });
    if (!destination) {
        return res.status(404).json({ errors: [`Destination Not Found`] });
    }
    await index_1.DI.em.remove(destination).flush();
    return res.status(201).send({});
});
exports.DestinationController = router;
