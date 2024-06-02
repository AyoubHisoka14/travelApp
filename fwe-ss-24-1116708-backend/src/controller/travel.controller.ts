import express, { Router } from 'express';
import { DI } from '../index';
import { CreateTravelDTO, CreateTravelSchema, Travel } from "../entities/Travel";
import { wrap } from "@mikro-orm/core";
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`); // Naming the file uniquely
    }
});

export const upload = multer({ storage });

router.get('/', async (req, res) => {
    const travels = await DI.travelRepository.findAll(
        { populate: ['travelDestinations', 'participants'] }
    );
    res.status(200).send(travels);
});

router.get('/:id', async (req, res) => {
    const travel = await DI.travelRepository.findOne({ id: req.params.id }, {
        populate: ['travelDestinations', 'participants'],
    });
    res.status(200).send(travel);
});

// Updated POST route to handle file uploads
router.post('/', upload.single('image'), async (req, res) => {
    const validatedData = await CreateTravelSchema.validate(req.body).catch((e) => {
        res.status(400).json({ errors: e.errors });
    });
    if (!validatedData) {
        return;
    }

    const createTravelDTO: CreateTravelDTO = {
        ...validatedData,
        image: req.file ? `/uploads/${req.file.filename}` : undefined // Set image property to undefined if no file is uploaded
    };


    const travel = new Travel(createTravelDTO);
    await DI.em.persistAndFlush(travel);
    res.status(201).send(travel);
});

router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const travel = await DI.travelRepository.findOne({ id: req.params.id }, {
            populate: ['travelDestinations'],
        });

        if (!travel) {
            return res.status(404).send({ message: 'Travel not found' });
        }

        wrap(travel).assign(req.body);
        if (req.file) {
            travel.image = `/uploads/${req.file.filename}`;
        }
        await DI.em.flush();
        res.json(travel);

    } catch (e: any) {
        return res.status(400).send({ errors: [e.message] });
    }
});

router.delete('/:id', async (req, res) => {
    const travel = await DI.travelRepository.findOne({ id: req.params.id }, {
        populate: ['travelDestinations']
    });
    if (!travel) {
        return res.status(403).json({ errors: [`You can't delete this id`] });
    }
    for (const destination of travel.travelDestinations) {
        await DI.em.remove(destination).flush()
    }
    await DI.em.remove(travel).flush();
    return res.status(204).send({});
});

// Define a static route to serve uploaded files
//router.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

export const TravelController = router;
