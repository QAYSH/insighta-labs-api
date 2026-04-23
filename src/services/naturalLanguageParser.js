const countryMap = {
  'nigeria': 'NG', 'ng': 'NG',
  'benin': 'BJ', 'bj': 'BJ',
  'ghana': 'GH', 'gh': 'GH',
  'kenya': 'KE', 'ke': 'KE',
  'south africa': 'ZA', 'za': 'ZA',
  'angola': 'AO', 'ao': 'AO',
  'tanzania': 'TZ', 'tz': 'TZ',
  'uganda': 'UG', 'ug': 'UG',
  'sudan': 'SD', 'sd': 'SD',
  'rwanda': 'RW', 'rw': 'RW',
  'zambia': 'ZM', 'zm': 'ZM',
  'zimbabwe': 'ZW', 'zw': 'ZW'
};

// List of valid query patterns (keywords that actually map to filters)
const validPatterns = [
  'male', 'males', 'men', 'man',
  'female', 'females', 'women', 'woman',
  'young',
  'child', 'children',
  'teenager', 'teenagers',
  'adult', 'adults',
  'senior', 'seniors',
  'above', 'over', 'older than', 'greater than',
  'below', 'under', 'younger than', 'less than',
  'age',
  'from'
];

export const parseQuery = (queryString) => {
  if (!queryString || queryString.trim() === '') {
    return null;
  }
  
  const query = queryString.toLowerCase().trim();
  const filters = {};
  
  // Check if query contains any valid pattern or country using word boundaries
  const hasValidPattern = validPatterns.some(pattern => {
    const regex = new RegExp(`\\b${pattern}\\b`, 'i');
    return regex.test(query);
  });
  
  const hasValidCountry = Object.keys(countryMap).some(country => {
    const regex = new RegExp(`\\b${country}\\b`, 'i');
    return regex.test(query);
  });
  
  // If no valid patterns and no country, it's garbage - return null immediately
  if (!hasValidPattern && !hasValidCountry) {
    return null;
  }

  
  // Gender detection
  const hasMale = /\b(male|males|men|man)\b/.test(query);
  const hasFemale = /\b(female|females|women|woman)\b/.test(query);
  
  if (hasMale && hasFemale) {
    // If both are mentioned, don't filter by gender (e.g. "male and female")
  } else if (hasMale) {
    filters.gender = 'male';
  } else if (hasFemale) {
    filters.gender = 'female';
  }

  
  // Age group detection
  const ageGroups = ['child', 'teenager', 'adult', 'senior'];
  for (const group of ageGroups) {
    const regex = new RegExp(`\\b${group}s?\\b`, 'i');
    if (regex.test(query)) {
      filters.age_group = group;
      break;
    }
  }
  
  // "young" special handling (ages 16-24)
  if (!filters.age_group && /\byoung\b/.test(query)) {
    filters.min_age = 16;
    filters.max_age = 24;
  }
  
  // Age comparisons (above/below/over/under)
  const aboveMatch = query.match(/\b(above|over|older than|greater than)\s+(\d+)\b/);
  if (aboveMatch) {
    filters.min_age = parseInt(aboveMatch[2]);
  }
  
  const belowMatch = query.match(/\b(below|under|younger than|less than)\s+(\d+)\b/);
  if (belowMatch) {
    filters.max_age = parseInt(belowMatch[2]);
  }
  
  // Exact age "age X"
  const exactAgeMatch = query.match(/\bage\s+(\d+)\b/);
  if (exactAgeMatch) {
    const age = parseInt(exactAgeMatch[1]);
    filters.min_age = age;
    filters.max_age = age;
  }
  
  // Country detection
  for (const [countryName, code] of Object.entries(countryMap)) {
    const regex = new RegExp(`\\b${countryName}\\b`, 'i');
    if (regex.test(query)) {
      filters.country_id = code;
      break;
    }
  }

  
  // If we have at least one filter, return it
  if (Object.keys(filters).length > 0) {
    return filters;
  }
  
  // If we got here but have no filters, it's not a valid query
  // (This handles cases like just the word "people" or random words)
  return null;
};