import { parseQuery } from '../services/naturalLanguageParser.js';
import { getProfiles } from './profilesController.js';

export const searchProfiles = async (req, res, next) => {
  try {
    const { q, page, limit } = req.query;

    // Check for missing or empty query
    if (!q || q.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Missing or empty parameter'
      });
    }


    // Parse the natural language query
    const filters = parseQuery(q);

    // If no filters could be parsed, return 422 error
    if (!filters || Object.keys(filters).length === 0) {
      return res.status(422).json({
        status: 'error',
        message: 'Unable to interpret query'
      });
    }

    // Merge parsed filters with pagination params
    req.query = {
      ...req.query,
      ...filters
    };

    // Reuse the profiles controller logic
    await getProfiles(req, res, next);git add 
  } catch (error) {
    next(error);
  }
};