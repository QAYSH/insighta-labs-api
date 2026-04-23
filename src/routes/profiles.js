import express from 'express';
import { getProfiles } from '../controllers/profilesController.js';
import { validateFilters } from '../middleware/validateParams.js';

const router = express.Router();

router.get('/', validateFilters, getProfiles);

export default router;
