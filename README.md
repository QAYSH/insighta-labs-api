# Natural Language Parsing Approach

## Supported Keywords and Mappings

| Query Term | Maps To | Notes |
|------------|---------|-------|
| male, males, men, man | gender=male | - |
| female, females, women, woman | gender=female | - |
| young | min_age=16, max_age=24 | Age range mapping only, not stored age_group |
| child | age_group=child | Ages 0-12 |
| teenager | age_group=teenager | Ages 13-19 |
| adult | age_group=adult | Ages 20-64 |
| senior | age_group=senior | Ages 65-120 |
| above/over/older than X | min_age=X | X must be number |
| below/under/younger than X | max_age=X | X must be number |
| age X | min_age=X, max_age=X | Exact age match |
| from [country] | country_id=XX | Supports Nigeria, Benin, Ghana, Kenya, South Africa, Angola |

## Parsing Logic Flow

1. **Tokenization**: Convert query to lowercase, trim whitespace
2. **Gender Detection**: Regex pattern matching for male/female variations
3. **Age Group Detection**: Priority order - explicit groups (child, teenager, adult, senior) first, then "young" as fallback
4. **Age Comparisons**: Extract numbers following above/below/over/under keywords
5. **Exact Age**: Pattern match "age [number]"
6. **Country Detection**: Lookup country name in predefined mapping
7. **Filter Combination**: Merge all detected filters into single object

## Conflict Resolution

- When both age_group and min/max age are present, all conditions are applied (AND logic)
- If contradictory filters exist (e.g., "young males above 30"), SQL returns empty results rather than guessing
- "young" is ignored if an explicit age_group is detected

## Limitations and Edge Cases

### Not Supported
- **Complex Boolean Logic**: AND/OR combinations like "males from nigeria OR females from kenya"
- **Negation**: "not from nigeria", "excluding males"
- **Relative Terms**: "older than average", "most common age"
- **Misspellings**: "nigerai" for Nigeria
- **Partial Matches**: "teen" for teenager
- **Multiple Countries**: "from nigeria and ghana"
- **Age Ranges Without Keywords**: "25-35 years old"
- **Probability Filters**: Can't query "high confidence" or "likely male"
- **Name-based Queries**: "find John"
- **Sorting Instructions**: "youngest first"

### Known Edge Cases
- **Overlapping Ranges**: "young adults" - parser picks "adult" over "young" (age_group has priority)
- **Ambiguous Age References**: "above 30 and below 40" - both min and max will be applied
- **Missing Country Data**: Query for "congo" will not match (not in mapping) - returns error
- **Empty Query String**: Returns 400 error with "Missing or empty query parameter"
- **No Keywords Detected**: Returns 422 error with "Unable to interpret query"

### Performance Considerations
- All database queries use indexed columns (gender, age_group, country_id, age, created_at, gender_probability)
- Pagination prevents large result sets (max 50 per page)
- Natural language parsing is O(n) where n is query length, no external API calls

## Example Queries

| Input | Interpreted Filters |
|-------|---------------------|
| "young males from nigeria" | gender=male, min_age=16, max_age=24, country_id=NG |
| "females above 30" | gender=female, min_age=30 |
| "people from angola" | country_id=AO |
| "adult males from kenya" | gender=male, age_group=adult, country_id=KE |
| "teenagers above 17" | age_group=teenager, min_age=17 |
| "women under 25" | gender=female, max_age=24 |
| "age 35" | min_age=35, max_age=35 |
