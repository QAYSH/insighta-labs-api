import pool from '../config/database.js';
import { buildWhereClause, buildOrderClause, buildPaginationClause } from '../services/queryBuilder.js';

const VALID_GENDERS = ['male', 'female'];
const VALID_AGE_GROUPS = ['child', 'teenager', 'adult', 'senior'];

export const getProfiles = async (req, res, next) => {
  try {
    const {
      gender, age_group, country_id,
      min_age, max_age,
      min_gender_probability, min_country_probability,
      sort_by, order,
      page: pageQuery = 1, limit: limitQuery = 10
    } = req.query;

    // Check for empty parameters (400 Bad Request)
    const queryParams = Object.keys(req.query);
    for (const key of queryParams) {
      if (req.query[key] === '') {
        const error = new Error('Missing or empty parameter');
        error.status = 400;
        throw error;
      }
    }

    // Validation (422 Unprocessable Entity)
    if (gender && !VALID_GENDERS.includes(gender)) {
      const error = new Error('Invalid query parameters');
      error.status = 422;
      throw error;
    }

    if (age_group && !VALID_AGE_GROUPS.includes(age_group)) {
      const error = new Error('Invalid query parameters');
      error.status = 422;
      throw error;
    }

    const filters = {
      gender,
      age_group,
      country_id,
    };

    // Numeric validation
    const validateNumeric = (val, name) => {
      if (val === undefined) return undefined;
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        const error = new Error('Invalid query parameters');
        error.status = 422;
        throw error;
      }
      return parsed;
    };

    filters.min_age = validateNumeric(min_age, 'min_age');
    filters.max_age = validateNumeric(max_age, 'max_age');
    filters.min_gender_probability = validateNumeric(min_gender_probability, 'min_gender_probability');
    filters.min_country_probability = validateNumeric(min_country_probability, 'min_country_probability');

    // Parse and validate pagination
    let page = parseInt(pageQuery);
    let limit = parseInt(limitQuery);
    
    if (isNaN(page) || isNaN(limit)) {
      const error = new Error('Invalid query parameters');
      error.status = 422;
      throw error;
    }

    // Cap limit at 50 (max allowed)
    if (limit > 50) limit = 50;
    if (limit < 1) limit = 10;
    if (page < 1) page = 1;

    const { whereClause, values } = buildWhereClause(filters);
    const orderClause = buildOrderClause(sort_by, order);
    const paginationClause = buildPaginationClause(page, limit);

    // Get total count
    const countQuery = `SELECT COUNT(*) FROM profiles ${whereClause}`;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data
    const dataQuery = `
      SELECT id, name, gender, gender_probability, age, age_group,
             country_id, country_name, country_probability, created_at
      FROM profiles
      ${whereClause}
      ${orderClause}
      ${paginationClause}
    `;

    const dataResult = await pool.query(dataQuery, values);

    res.json({
      status: 'success',
      page: page,
      limit: limit,
      total: total,
      data: dataResult.rows
    });
  } catch (error) {
    next(error);
  }
};