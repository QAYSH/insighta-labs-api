const ALLOWED_SORT_FIELDS = ['age', 'created_at', 'gender_probability'];
const ALLOWED_ORDER = ['asc', 'desc'];

export const buildWhereClause = (filters) => {
  const conditions = [];
  const values = [];
  let paramIndex = 1;

  if (filters.gender) {
    conditions.push(`gender = $${paramIndex++}`);
    values.push(filters.gender);
  }

  if (filters.age_group) {
    conditions.push(`age_group = $${paramIndex++}`);
    values.push(filters.age_group);
  }

  if (filters.country_id) {
    conditions.push(`country_id = $${paramIndex++}`);
    values.push(filters.country_id);
  }

  if (filters.min_age !== undefined) {
    conditions.push(`age >= $${paramIndex++}`);
    values.push(filters.min_age);
  }

  if (filters.max_age !== undefined) {
    conditions.push(`age <= $${paramIndex++}`);
    values.push(filters.max_age);
  }

  if (filters.min_gender_probability !== undefined) {
    conditions.push(`gender_probability >= $${paramIndex++}`);
    values.push(filters.min_gender_probability);
  }

  if (filters.min_country_probability !== undefined) {
    conditions.push(`country_probability >= $${paramIndex++}`);
    values.push(filters.min_country_probability);
  }

  const whereClause = conditions.length > 0 
    ? `WHERE ${conditions.join(' AND ')}` 
    : '';

  return { whereClause, values };
};

export const buildOrderClause = (sortBy, order = 'asc') => {
  const field = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'created_at';
  const direction = ALLOWED_ORDER.includes(order.toLowerCase()) ? order.toUpperCase() : 'DESC';
  
  return `ORDER BY ${field} ${direction}`;
};

export const buildPaginationClause = (page, limit) => {
  const offset = (page - 1) * limit;
  return `LIMIT ${limit} OFFSET ${offset}`;
};