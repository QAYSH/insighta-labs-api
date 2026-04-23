
# Insighta Labs Demographic Intelligence API

## Overview

A RESTful API for demographic data intelligence, enabling marketing teams, product analysts, and growth teams to query and slice demographic profiles with advanced filtering, pagination, sorting, and natural language search capabilities.

**Base URL:** `https://insighta-labs-api-vtwo.vercel.app`

---

## Features

- ✅ **Advanced Filtering** - Filter by gender, age group, country, age range, and probability thresholds
- ✅ **Pagination** - Navigate through 2026 profiles with configurable page sizes (max 50)
- ✅ **Sorting** - Sort results by age, creation date, or gender probability
- ✅ **Natural Language Search** - Query profiles using plain English (rule-based, no AI/LLM)
- ✅ **CORS Enabled** - Accessible from any web application
- ✅ **UUID v7** - Time-sortable unique identifiers for all profiles

---

## Technology Stack

| Technology | Purpose |
|------------|---------|
| Node.js + Express | API framework |
| PostgreSQL (Supabase) | Database |
| UUID v7 | Primary key generation |
| Vercel | Deployment platform |

---

## API Endpoints

### 1. GET `/api/profiles` - Structured Query

Retrieve profiles with filtering, sorting, and pagination.

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `gender` | string | `male` or `female` | `gender=male` |
| `age_group` | string | `child`, `teenager`, `adult`, `senior` | `age_group=adult` |
| `country_id` | string | ISO 2-letter code (e.g., NG, KE, ZA) | `country_id=NG` |
| `min_age` | integer | Minimum age (0-120) | `min_age=18` |
| `max_age` | integer | Maximum age (0-120) | `max_age=65` |
| `min_gender_probability` | float | 0.0 to 1.0 | `min_gender_probability=0.8` |
| `min_country_probability` | float | 0.0 to 1.0 | `min_country_probability=0.7` |
| `sort_by` | string | `age`, `created_at`, `gender_probability` | `sort_by=age` |
| `order` | string | `asc` or `desc` (default: `asc`) | `order=desc` |
| `page` | integer | Page number (default: 1) | `page=2` |
| `limit` | integer | Results per page, max 50 (default: 10) | `limit=20` |

#### Example Requests

**Basic request:**
```bash
GET /api/profiles
Filtered by gender and country:

bash
GET /api/profiles?gender=male&country_id=NG&limit=5
Age range with sorting:

bash
GET /api/profiles?min_age=25&max_age=40&sort_by=age&order=desc
Combined filters:

bash
GET /api/profiles?gender=female&age_group=senior&min_gender_probability=0.8
Pagination:

bash
GET /api/profiles?page=2&limit=20
Success Response (200)
json
{
  "status": "success",
  "page": 1,
  "limit": 10,
  "total": 2026,
  "data": [
    {
      "id": "019db993-e6bc-764a-8afa-0d94e283dd3d",
      "name": "Awino Hassan",
      "gender": "female",
      "gender_probability": 0.66,
      "age": 68,
      "age_group": "senior",
      "country_id": "TZ",
      "country_name": "Tanzania",
      "country_probability": 0.6,
      "created_at": "2026-04-23T09:02:51.068Z"
    }
  ]
}
2. GET /api/profiles/search - Natural Language Query
Query profiles using plain English. Pagination parameters (page, limit) also apply.

Example Requests
bash
GET /api/profiles/search?q=young males from nigeria
GET /api/profiles/search?q=females above 30
GET /api/profiles/search?q=adults from kenya
GET /api/profiles/search?q=senior women
GET /api/profiles/search?q=teenagers
GET /api/profiles/search?q=age 35
Response (200)
Same format as /api/profiles endpoint.

Natural Language Parsing
Approach
The parser uses rule-based pattern matching with regular expressions - no AI, no LLMs, no external APIs. This ensures predictable, fast, and deterministic behavior.

Supported Keywords & Mappings
Query Term	Maps To	Notes
male, males, men, man	gender=male	-
female, females, women, woman	gender=female	-
young	min_age=16, max_age=24	Age range only, not a stored age_group
child, children	age_group=child	Ages 0-12
teenager, teenagers	age_group=teenager	Ages 13-19
adult, adults	age_group=adult	Ages 20-64
senior, seniors	age_group=senior	Ages 65-120
above X, over X, older than X, greater than X	min_age=X	X must be a number
below X, under X, younger than X, less than X	max_age=X	X must be a number
age X	min_age=X, max_age=X	Exact age match
from [country]	country_id=XX	See supported countries below
Supported Countries
Country	ISO Code	Keywords
Nigeria	NG	nigeria, ng
Kenya	KE	kenya, ke
South Africa	ZA	south africa, za
Ghana	GH	ghana, gh
Angola	AO	angola, ao
Tanzania	TZ	tanzania, tz
Uganda	UG	uganda, ug
Benin	BJ	benin, bj
Zambia	ZM	zambia, zm
Zimbabwe	ZW	zimbabwe, zw
Rwanda	RW	rwanda, rw
Sudan	SD	sudan, sd
Parsing Logic Flow
text
User Query → Lowercase/Trim → Pattern Matching → Filter Object → SQL Query
Tokenization: Convert query to lowercase, trim whitespace

Gender Detection: Regex pattern matching (\b(male|males|men|man)\b)

Age Group Detection: Priority order - explicit groups first (child, teenager, adult, senior), then young as fallback

Age Comparisons: Extract numbers following above/below/over/under keywords

Exact Age: Pattern match age [number]

Country Detection: Lookup country name in predefined mapping

Filter Combination: Merge all detected filters into single object (AND logic)

Conflict Resolution
When both age_group and min_age/max_age are present, all conditions are applied (AND logic)

If contradictory filters exist (e.g., young males above 30), SQL returns empty results rather than guessing

young is ignored if an explicit age_group is detected

Example Parsing Results
Input Query	Interpreted Filters
young males from nigeria	gender=male, min_age=16, max_age=24, country_id=NG
females above 30	gender=female, min_age=30
people from angola	country_id=AO
adult males from kenya	gender=male, age_group=adult, country_id=KE
teenagers above 17	age_group=teenager, min_age=17
women under 25	gender=female, max_age=24
age 35	min_age=35, max_age=35
Limitations & Edge Cases
Not Supported
The parser explicitly does NOT support:

Category	Examples
Complex Boolean Logic	males from nigeria OR females from kenya
Negation	not from nigeria, excluding males
Relative Terms	older than average, most common age
Misspellings	nigerai for Nigeria, teen for teenager
Partial Matches	teen for teenager, ad for adult
Multiple Countries	from nigeria and ghana
Age Ranges Without Keywords	25-35 years old
Probability Filters	high confidence, likely male
Name-based Queries	find John
Sorting Instructions	youngest first, oldest to newest
Known Edge Cases
Edge Case	Behavior
young adults	Parser picks adult over young (age_group has priority) → returns adults of all ages
above 30 and below 40	Both min_age=30 and max_age=40 are applied
Query for congo	Not in country mapping → returns 422 error
Empty query string (q=)	Returns 400 error: Missing or empty query parameter
No keywords detected (purple elephants)	Returns 422 error: Unable to interpret query
Contradictory filters (young males above 30)	SQL returns empty result set (no matches)
Error Handling
All errors follow a consistent format:

json
{
  "status": "error",
  "message": "<error message>"
}
HTTP Status Codes
Status	Description
200	Success
400	Missing or empty parameter
422	Invalid parameter type or unable to interpret query
404	Resource not found
500	Internal server error
Example Error Responses
Invalid gender:

json
{
  "status": "error",
  "message": "gender must be male or female"
}
Uninterpretable natural language query:

json
{
  "status": "error",
  "message": "Unable to interpret query"
}
Empty search query:

json
{
  "status": "error",
  "message": "Missing or empty query parameter"
}
Limit exceeds maximum:

json
{
  "status": "error",
  "message": "limit must be between 1 and 50"
}
Database Schema
sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  gender VARCHAR(10) NOT NULL,
  gender_probability FLOAT NOT NULL,
  age INT NOT NULL,
  age_group VARCHAR(20) NOT NULL,
  country_id VARCHAR(2) NOT NULL,
  country_name VARCHAR(100) NOT NULL,
  country_probability FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_gender ON profiles(gender);
CREATE INDEX idx_age_group ON profiles(age_group);
CREATE INDEX idx_country_id ON profiles(country_id);
CREATE INDEX idx_age ON profiles(age);
CREATE INDEX idx_created_at ON profiles(created_at);
CREATE INDEX idx_gender_prob ON profiles(gender_probability);
Local Development
Prerequisites
Node.js (v18 or higher)

PostgreSQL database (Supabase recommended)

Setup Instructions
bash
# Clone repository
git clone https://github.com/QAYSH/insighta-labs-api.git
cd insighta-labs-api

# Install dependencies
npm install

# Create .env file with your database URL
echo "SUPABASE_DB_URL=your_database_url_here" > .env

# Seed the database with 2026 profiles
npm run seed

# Start development server
npm run dev
Available Scripts
Command	Description
npm run dev	Start development server with hot reload
npm start	Start production server
npm run seed	Seed database with 2026 profiles (idempotent)
Deployment
This API is deployed on Vercel. Environment variables required:

Variable	Description
SUPABASE_DB_URL	PostgreSQL connection string (Supabase pooler URL recommended)
Deployment Commands
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add SUPABASE_DB_URL production
Performance Considerations
All filterable columns are indexed (gender, age_group, country_id, age, created_at, gender_probability)

Pagination prevents large result sets (max 50 per page)

Natural language parsing is O(n) where n = query length, with no external API calls

Connection pooling enabled for database efficiency

Testing
Run the automated test suite:

bash
node test-api.js
Or test manually with curl:

bash
# Basic endpoint
curl https://insighta-labs-api-vtwo.vercel.app/api/profiles

# Natural language search
curl "https://insighta-labs-api-vtwo.vercel.app/api/profiles/search?q=young%20males%20from%20nigeria"

# Invalid query (returns 422)
curl "https://insighta-labs-api-vtwo.vercel.app/api/profiles/search?q=xyzabc"
Project Structure
text
insighta-labs-api/
├── src/
│   ├── config/
│   │   └── database.js        # Database connection pool
│   ├── controllers/
│   │   ├── profilesController.js
│   │   └── searchController.js
│   ├── middleware/
│   │   ├── cors.js
│   │   ├── errorHandler.js
│   │   └── validateParams.js
│   ├── routes/
│   │   ├── profiles.js
│   │   └── search.js
│   ├── scripts/
│   │   └── seed.js            # Database seeder
│   ├── services/
│   │   ├── naturalLanguageParser.js
│   │   └── queryBuilder.js
│   ├── app.js
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md
Author
Insighta Labs - Demographic Intelligence Platform

License
Proprietary - All rights reserved

Support
For issues or questions, contact the Insighta Labs development team.
