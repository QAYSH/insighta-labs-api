import express from 'express';
import { searchProfiles } from '../controllers/searchController.js';

const router = express.Router();

router.get('/', searchProfiles);

export default router;
