import { Router } from 'express';

import { DI } from '../index';
import {CreateDestinationDTO, CreateDestinationSchema, TravelDestination} from "../entities/TravelDestination";
import {wrap} from "@mikro-orm/core";
import {upload} from "./travel.controller";

const router = Router();

router.get('/', async (req, res) => {
    const destinations = await DI.destinationRepository.findAll(
    );
    res.status(200).send(destinations);
});

router.get('/:id', async (req, res) => {
    const destination = await DI.destinationRepository.findOne({id: req.params.id}, {
        populate: ['travel'],
    });
    res.status(200).send(destination);
});

router.post('/:id', upload.single('image'), async (req, res) => {
    const validatedData = await CreateDestinationSchema.validate(req.body).catch((e) => {
        res.status(400).json({ errors: e.errors });
    });
    if (!validatedData) {
        return;
    }

    const createDestinationDTO : CreateDestinationDTO = {
        ... validatedData,
        image: req.file ? `/uploads/${req.file.filename}` : undefined
    }

    const destination = new TravelDestination(createDestinationDTO);

    const travel = await DI.travelRepository.findOne({ id: req.params.id });

    wrap(destination).assign({ travel: travel }, { em: DI.em });
    await DI.em.persistAndFlush(destination);
    await DI.destinationRepository.populate(destination, ['travel']);

    res.status(201).send(destination);

});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const destination = await DI.destinationRepository.findOne({id: req.params.id}, {
            populate: ['travel'],
        });

        if (!destination) {
            return res.status(404).send({ message: 'Destination not found' });
        }

        wrap(destination).assign(req.body);
        if (req.file) {
            destination.image = `/uploads/${req.file.filename}`;
        }
        await DI.em.flush();
        //res.json(destination);
        res.status(201).send(destination);

    } catch (e: any) {
        return res.status(400).send({ errors: [e.message] });
    }
});

router.delete('/:id', async (req, res) => {
    // diary Entry laden
    const destination = await DI.destinationRepository.findOne({id: req.params.id
    });
    if (!destination) {
        return res.status(403).json({ errors: [`You can't delete this id`] });
    }

    await DI.em.remove(destination).flush();
    return res.status(204).send({});
});


export const DestinationController = router;
