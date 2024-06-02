"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TravelController = exports.upload = void 0;
const express_1 = require("express");
const index_1 = require("../index");
const Travel_1 = require("../entities/Travel");
const core_1 = require("@mikro-orm/core");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads/'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`); // Naming the file uniquely
    }
});
exports.upload = (0, multer_1.default)({ storage });
router.get('/', async (req, res) => {
    const travels = await index_1.DI.travelRepository.findAll({ populate: ['travelDestinations', 'participants'] });
    res.status(200).send(travels);
});
router.get('/:id', async (req, res) => {
    const travel = await index_1.DI.travelRepository.findOne({ id: req.params.id }, {
        populate: ['travelDestinations', 'participants'],
    });
    res.status(200).send(travel);
});
// Updated POST route to handle file uploads
router.post('/', exports.upload.single('image'), async (req, res) => {
    const validatedData = await Travel_1.CreateTravelSchema.validate(req.body).catch((e) => {
        res.status(400).json({ errors: e.errors });
    });
    if (!validatedData) {
        return;
    }
    const createTravelDTO = {
        ...validatedData,
        image: req.file ? `/uploads/${req.file.filename}` : undefined // Set image property to undefined if no file is uploaded
    };
    const travel = new Travel_1.Travel(createTravelDTO);
    await index_1.DI.em.persistAndFlush(travel);
    res.status(201).send(travel);
});
router.put('/:id', exports.upload.single('image'), async (req, res) => {
    try {
        const travel = await index_1.DI.travelRepository.findOne({ id: req.params.id }, {
            populate: ['travelDestinations'],
        });
        if (!travel) {
            return res.status(404).send({ message: 'Travel not found' });
        }
        (0, core_1.wrap)(travel).assign(req.body);
        if (req.file) {
            travel.image = `/uploads/${req.file.filename}`;
        }
        await index_1.DI.em.flush();
        res.json(travel);
    }
    catch (e) {
        return res.status(400).send({ errors: [e.message] });
    }
});
router.delete('/:id', async (req, res) => {
    const travel = await index_1.DI.travelRepository.findOne({ id: req.params.id }, {
        populate: ['travelDestinations']
    });
    if (!travel) {
        return res.status(403).json({ errors: [`You can't delete this id`] });
    }
    for (const destination of travel.travelDestinations) {
        await index_1.DI.em.remove(destination).flush();
    }
    await index_1.DI.em.remove(travel).flush();
    return res.status(204).send({});
});
// Define a static route to serve uploaded files
//router.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));
exports.TravelController = router;
