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

    const existingParticipant = await DI.participantRepository.findOne({name: validatedData.name});
    if (existingParticipant) {
        return res.status(400).json({error: 'Participant with this name already exists'});
    }

    const createParticipantDTO = {
        ...validatedData,
        image: req.file ? `/uploads/${req.file.filename}` : undefined
    };

    const participant = new Participant(createParticipantDTO);

    const travel = await DI.travelRepository.findOne({id: req.params.id});

    if (!travel) {
        return res.status(404).json({error: 'Travel not found'});
    }

    participant.travels.add(travel);

    await DI.em.persistAndFlush(participant);

    await DI.participantRepository.populate(participant, ['travels']);

    res.status(201).send(participant);

});


router.post('/:id/:name', async (req, res) => {

    const existingParticipant = await DI.participantRepository.findOne({name: req.params.name}, {
        populate: ['travels'],
    });

    if (existingParticipant) {
        const travel = await DI.travelRepository.findOne({ id: req.params.id });

        if (travel) {
            // Check if the participant is already part of the travel
            const isParticipantInTravel = existingParticipant.travels.getItems().some(tr => tr.id === travel.id);

            if (isParticipantInTravel) {
                return res.status(400).json({ error: 'Participant is already part of this travel' });
            }

            existingParticipant.travels.add(travel);
            await DI.em.flush();
            await DI.participantRepository.populate(existingParticipant, ['travels']);
            return res.status(201).send(existingParticipant);
        } else {
            return res.status(404).json({ error: 'Travel Not Found' });
        }
    } else {
        return res.status(404).json({ error: 'Participant Not Found' });
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
