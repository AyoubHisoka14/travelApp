"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantController = void 0;
const express_1 = require("express");
const index_1 = require("../index");
const Participant_1 = require("../entities/Participant");
const travel_controller_1 = require("./travel.controller");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    const participants = await index_1.DI.participantRepository.findAll();
    res.status(200).send(participants);
});
router.get('/:id', async (req, res) => {
    const participant = await index_1.DI.participantRepository.findOne({ id: req.params.id }, {
        populate: ['travels'],
    });
    res.status(200).send(participant);
});
router.post('/:id', travel_controller_1.upload.single('image'), async (req, res) => {
    // Validate input data
    const validatedData = await Participant_1.CreateParticipantSchema.validate(req.body);
    const existingParticipant = await index_1.DI.participantRepository.findOne({ name: validatedData.name });
    if (existingParticipant) {
        return res.status(400).json({ error: 'Participant with this name already exists' });
    }
    const createParticipantDTO = {
        ...validatedData,
        image: req.file ? `/uploads/${req.file.filename}` : undefined
    };
    const participant = new Participant_1.Participant(createParticipantDTO);
    const travel = await index_1.DI.travelRepository.findOne({ id: req.params.id });
    if (!travel) {
        return res.status(404).json({ error: 'Travel not found' });
    }
    participant.travels.add(travel);
    await index_1.DI.em.persistAndFlush(participant);
    await index_1.DI.participantRepository.populate(participant, ['travels']);
    res.status(201).send(participant);
});
router.post('/:id/:name', async (req, res) => {
    const existingParticipant = await index_1.DI.participantRepository.findOne({ name: req.params.name }, {
        populate: ['travels'],
    });
    if (existingParticipant) {
        const travel = await index_1.DI.travelRepository.findOne({ id: req.params.id });
        if (travel) {
            // Check if the participant is already part of the travel
            const isParticipantInTravel = existingParticipant.travels.getItems().some(tr => tr.id === travel.id);
            if (isParticipantInTravel) {
                return res.status(400).json({ error: 'Participant is already part of this travel' });
            }
            existingParticipant.travels.add(travel);
            await index_1.DI.em.flush();
            await index_1.DI.participantRepository.populate(existingParticipant, ['travels']);
            return res.status(201).send(existingParticipant);
        }
        else {
            return res.status(404).json({ error: 'Travel Not Found' });
        }
    }
    else {
        return res.status(404).json({ error: 'Participant Not Found' });
    }
});
router.put('/:id', travel_controller_1.upload.single('image'), async (req, res) => {
    try {
        const participant = await index_1.DI.participantRepository.findOne({ id: req.params.id }, {
            populate: ['travels'],
        });
        if (!participant) {
            return res.status(404).send({ message: 'Participant not found' });
        }
        participant.name = req.body.name;
        if (req.file) {
            participant.image = `/uploads/${req.file.filename}`;
        }
        //wrap(participant).assign(req.body);
        await index_1.DI.em.flush();
        res.status(201).send(participant);
    }
    catch (e) {
        return res.status(400).send({ errors: [e.message] });
    }
});
router.delete('/:id', async (req, res) => {
    const participant = await index_1.DI.participantRepository.findOne({ id: req.params.id }, {});
    if (!participant) {
        return res.status(404).json({ errors: [`Participant not found`] });
    }
    await index_1.DI.em.remove(participant).flush();
    return res.status(200).send({});
});
exports.ParticipantController = router;
