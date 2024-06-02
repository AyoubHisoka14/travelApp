import {Router} from 'express';

import {DI} from '../index';
import {wrap} from "@mikro-orm/core";
import {CreateParticipantDTO, CreateParticipantSchema, Participant} from "../entities/Participant";
import {upload} from "./travel.controller";

const router = Router();

router.get('/', async (req, res) => {
    const participants = await DI.participantRepository.findAll(
    );
    res.status(200).send(participants);
});

router.get('/:id', async (req, res) => {
    const participant = await DI.participantRepository.findOne({id: req.params.id}, {
        populate: ['travels'],
    });
    res.status(200).send(participant);
});

router.post('/:id', upload.single('image'), async (req, res) => {

    // Validate input data
    const validatedData = await CreateParticipantSchema.validate(req.body);

    // Check if participant name already exists
    const existingParticipant = await DI.participantRepository.findOne({name: validatedData.name});
    if (existingParticipant) {
        return res.status(409).json({error: 'Participant with this name already exists'});
    }

    // Create the participant DTO including the image URL
    const createParticipantDTO = {
        ...validatedData,
        image: req.file ? `/uploads/${req.file.filename}` : undefined
    };

    // Create a new participant entity
    const participant = new Participant(createParticipantDTO);

    // Find the travel by ID
    const travel = await DI.travelRepository.findOne({id: req.params.id});

    // Check if travel exists
    if (!travel) {
        return res.status(404).json({error: 'Travel not found'});
    }

    // Add the travel to the participant's travels
    participant.travels.add(travel);

    // Persist the participant entity
    await DI.em.persistAndFlush(participant);

    // Populate the participant's travels to include in the response
    await DI.participantRepository.populate(participant, ['travels']);

    // Send the response
    res.status(201).send(participant);

});


router.post('/:id/:name', async (req, res) => {


    const existingParticipant = await DI.participantRepository.findOne({name: req.params.name})
    if (existingParticipant) {
        const travel = await DI.travelRepository.findOne({id: req.params.id});
        if (travel) {
            existingParticipant.travels.add(travel);
            await DI.em.flush();
            await DI.participantRepository.populate(existingParticipant, ['travels']);
            res.status(201).send(existingParticipant);
            return;
        }
    } else {
        throw new Error('Participant not found');
    }
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const participant = await DI.participantRepository.findOne({id: req.params.id}, {
            populate: ['travels'],
        });

        if (!participant) {
            return res.status(404).send({message: 'Participant not found'});
        }
        participant.name=req.body.name;
        if (req.file) {
            participant.image = `/uploads/${req.file.filename}`;
        }
        console.log("No pic");

        //wrap(participant).assign(req.body);
        await DI.em.flush();

        res.status(201).send(participant);

    } catch (e: any) {
        return res.status(400).send({errors: [e.message]});
    }
});

router.delete('/:id', async (req, res) => {

    const participant = await DI.participantRepository.findOne({id: req.params.id}, {});
    if (!participant) {
        return res.status(403).json({errors: [`You can't delete this id`]});
    }

    await DI.em.remove(participant).flush();
    return res.status(204).send({});
});
export const ParticipantController = router;
