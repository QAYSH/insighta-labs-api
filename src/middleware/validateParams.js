export const validateFilters = (req, res, next) => {
  const { gender, age_group, country_id, min_age, max_age, min_gender_probability, min_country_probability, sort_by, order, page, limit } = req.query;

  // Gender validation
  if (gender && !['male', 'female'].includes(gender)) {
    return res.status(422).json({ 
      status: 'error', 
      message: 'gender must be male or female' 
    });
  }

  // Age group validation
  const validAgeGroups = ['child', 'teenager', 'adult', 'senior'];
  if (age_group && !validAgeGroups.includes(age_group)) {
    return res.status(422).json({ 
      status: 'error', 
      message: 'age_group must be child, teenager, adult, or senior' 
    });
  }

  // Age validation
  if (min_age && (isNaN(min_age) || min_age < 0 || min_age > 120)) {
    return res.status(422).json({ 
      status: 'error', 
      message: 'min_age must be a number between 0 and 120' 
    });
  }

  if (max_age && (isNaN(max_age) || max_age < 0 || max_age > 120)) {
    return res.status(422).json({ 
      status: 'error', 
      message: 'max_age must be a number between 0 and 120' 
    });
  }

  // Probability validation
  if (min_gender_probability && (isNaN(min_gender_probability) || min_gender_probability < 0 || min_gender_probability > 1)) {
    return res.status(422).json({ 
      status: 'error', 
      message: 'min_gender_probability must be a number between 0 and 1' 
    });
  }

  if (min_country_probability && (isNaN(min_country_probability) || min_country_probability < 0 || min_country_probability > 1)) {
    return res.status(422).json({ 
      status: 'error', 
      message: 'min_country_probability must be a number between 0 and 1' 
    });
  }

  // Sort validation
  const validSortFields = ['age', 'created_at', 'gender_probability'];
  if (sort_by && !validSortFields.includes(sort_by)) {
    return res.status(422).json({ 
      status: 'error', 
      message: 'sort_by must be age, created_at, or gender_probability' 
    });
  }

  if (order && !['asc', 'desc'].includes(order)) {
    return res.status(422).json({ 
      status: 'error', 
      message: 'order must be asc or desc' 
    });
  }

  // Pagination validation - allow limit up to 50, cap if higher
  if (page && (isNaN(page) || page < 1)) {
    return res.status(422).json({ 
      status: 'error', 
      message: 'page must be a positive integer' 
    });
  }

  // For limit, we'll cap at 50 instead of returning error
  if (limit) {
    if (isNaN(limit) || limit < 1) {
      return res.status(422).json({ 
        status: 'error', 
        message: 'limit must be a positive integer' 
      });
    }
    // Don't return error, just cap in controller
  }

  next();
};