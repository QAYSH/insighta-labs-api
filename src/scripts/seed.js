// import pool from '../config/database.js';
// import { v7 as uuidv7 } from 'uuid';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// async function seedDatabase() {
//   try {
//     console.log('Starting database seed...');

//     // Create table if not exists
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS profiles (
//         id UUID PRIMARY KEY,
//         name VARCHAR(255) UNIQUE NOT NULL,
//         gender VARCHAR(10) NOT NULL,
//         gender_probability FLOAT NOT NULL,
//         age INT NOT NULL,
//         age_group VARCHAR(20) NOT NULL,
//         country_id VARCHAR(2) NOT NULL,
//         country_name VARCHAR(100) NOT NULL,
//         country_probability FLOAT NOT NULL,
//         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//       );
      
//       CREATE INDEX IF NOT EXISTS idx_gender ON profiles(gender);
//       CREATE INDEX IF NOT EXISTS idx_age_group ON profiles(age_group);
//       CREATE INDEX IF NOT EXISTS idx_country_id ON profiles(country_id);
//       CREATE INDEX IF NOT EXISTS idx_age ON profiles(age);
//       CREATE INDEX IF NOT EXISTS idx_created_at ON profiles(created_at);
//       CREATE INDEX IF NOT EXISTS idx_gender_prob ON profiles(gender_probability);
//     `);

//     // Read JSON file - handle both formats
//     const profilesPath = path.join(__dirname, '../../seed_profiles.json');
//     const fileContent = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    
//     // Check if the file has a 'profiles' wrapper or is directly an array
//     const profilesData = fileContent.profiles || fileContent;
    
//     if (!Array.isArray(profilesData)) {
//       throw new Error('Invalid JSON format: Expected an array of profiles or object with "profiles" array');
//     }
    
//     console.log(`Found ${profilesData.length} profiles to seed`);

//     let inserted = 0;
//     let skipped = 0;

//     for (const profile of profilesData) {
//       const result = await pool.query(`
//         INSERT INTO profiles (id, name, gender, gender_probability, age, age_group, 
//                               country_id, country_name, country_probability, created_at)
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
//         ON CONFLICT (name) DO NOTHING
//         RETURNING id;
//       `, [
//         uuidv7(), 
//         profile.name, 
//         profile.gender, 
//         profile.gender_probability,
//         profile.age, 
//         profile.age_group, 
//         profile.country_id, 
//         profile.country_name,
//         profile.country_probability, 
//         new Date().toISOString()
//       ]);
      
//       if (result.rows.length > 0) {
//         inserted++;
//       } else {
//         skipped++;
//       }
      
//       // Progress update every 100 records
//       if ((inserted + skipped) % 100 === 0) {
//         console.log(`Processed ${inserted + skipped}/${profilesData.length} profiles...`);
//       }
//     }

//     console.log(`\n✅ Seed complete: ${inserted} inserted, ${skipped} skipped (duplicates)`);
    
//     // Verify total count
//     const countResult = await pool.query('SELECT COUNT(*) FROM profiles');
//     console.log(`📊 Total profiles in database: ${countResult.rows[0].count}`);
    
//     await pool.end();
//   } catch (error) {
//     console.error('❌ Seeding failed:', error.message);
//     await pool.end();
//     process.exit(1);
//   }
// }

// seedDatabase();


// import pool from '../config/database.js';
// import { v7 as uuidv7 } from 'uuid';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// async function seedDatabase() {
//   try {
//     console.log('Starting database seed...');
//     console.log('Step 1: Checking database connection...');
    
//     // Test database connection
//     try {
//       await pool.query('SELECT NOW()');
//       console.log('✅ Database connected successfully');
//     } catch (err) {
//       console.error('❌ Database connection failed:', err.message);
//       process.exit(1);
//     }

//     console.log('Step 2: Creating table and indexes...');
    
//     // Create table if not exists
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS profiles (
//         id UUID PRIMARY KEY,
//         name VARCHAR(255) UNIQUE NOT NULL,
//         gender VARCHAR(10) NOT NULL,
//         gender_probability FLOAT NOT NULL,
//         age INT NOT NULL,
//         age_group VARCHAR(20) NOT NULL,
//         country_id VARCHAR(2) NOT NULL,
//         country_name VARCHAR(100) NOT NULL,
//         country_probability FLOAT NOT NULL,
//         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//       );
      
//       CREATE INDEX IF NOT EXISTS idx_gender ON profiles(gender);
//       CREATE INDEX IF NOT EXISTS idx_age_group ON profiles(age_group);
//       CREATE INDEX IF NOT EXISTS idx_country_id ON profiles(country_id);
//       CREATE INDEX IF NOT EXISTS idx_age ON profiles(age);
//       CREATE INDEX IF NOT EXISTS idx_created_at ON profiles(created_at);
//       CREATE INDEX IF NOT EXISTS idx_gender_prob ON profiles(gender_probability);
//     `);
//     console.log('✅ Table and indexes created');

//     console.log('Step 3: Reading JSON file...');
    
//     // Read JSON file - handle both formats
//     const profilesPath = path.join(__dirname, '../../seed_profiles.json');
//     console.log(`Looking for file at: ${profilesPath}`);
    
//     if (!fs.existsSync(profilesPath)) {
//       console.error(`❌ File not found at: ${profilesPath}`);
//       console.log('Please ensure seed_profiles.json is in the root folder');
//       process.exit(1);
//     }
    
//     const fileContent = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    
//     // Check if the file has a 'profiles' wrapper or is directly an array
//     const profilesData = fileContent.profiles || fileContent;
    
//     if (!Array.isArray(profilesData)) {
//       throw new Error('Invalid JSON format: Expected an array of profiles or object with "profiles" array');
//     }
    
//     console.log(`✅ Found ${profilesData.length} profiles to seed`);

//     console.log('Step 4: Inserting profiles...');
    
//     let inserted = 0;
//     let skipped = 0;

//     for (let i = 0; i < profilesData.length; i++) {
//       const profile = profilesData[i];
      
//       try {
//         const result = await pool.query(`
//           INSERT INTO profiles (id, name, gender, gender_probability, age, age_group, 
//                                 country_id, country_name, country_probability, created_at)
//           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
//           ON CONFLICT (name) DO NOTHING
//           RETURNING id;
//         `, [
//           uuidv7(), 
//           profile.name, 
//           profile.gender, 
//           profile.gender_probability,
//           profile.age, 
//           profile.age_group, 
//           profile.country_id, 
//           profile.country_name,
//           profile.country_probability, 
//           new Date().toISOString()
//         ]);
        
//         if (result.rows.length > 0) {
//           inserted++;
//         } else {
//           skipped++;
//         }
//       } catch (insertErr) {
//         console.error(`Error inserting profile ${profile.name}:`, insertErr.message);
//         skipped++;
//       }
      
//       // Progress update every 100 records
//       if ((inserted + skipped) % 100 === 0) {
//         console.log(`Processed ${inserted + skipped}/${profilesData.length} profiles... (${inserted} inserted, ${skipped} skipped)`);
//       }
//     }

//     console.log(`\n✅ Seed complete: ${inserted} inserted, ${skipped} skipped (duplicates)`);
    
//     // Verify total count
//     const countResult = await pool.query('SELECT COUNT(*) FROM profiles');
//     console.log(`📊 Total profiles in database: ${countResult.rows[0].count}`);
    
//     await pool.end();
//   } catch (error) {
//     console.error('❌ Seeding failed:', error.message);
//     console.error('Full error:', error);
//     await pool.end();
//     process.exit(1);
//   }
// }

// seedDatabase();


import 'dotenv/config';
import pool from '../config/database.js';
import { v7 as uuidv7 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seedDatabase() {
  try {
    console.log('Starting database seed...');
    console.log('Step 1: Testing database connection...');
    
    // Test connection
    const testResult = await pool.query('SELECT NOW()');
    console.log('✅ Database connected at:', testResult.rows[0].now);

    console.log('Step 2: Creating table and indexes...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
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
      
      CREATE INDEX IF NOT EXISTS idx_gender ON profiles(gender);
      CREATE INDEX IF NOT EXISTS idx_age_group ON profiles(age_group);
      CREATE INDEX IF NOT EXISTS idx_country_id ON profiles(country_id);
      CREATE INDEX IF NOT EXISTS idx_age ON profiles(age);
      CREATE INDEX IF NOT EXISTS idx_created_at ON profiles(created_at);
      CREATE INDEX IF NOT EXISTS idx_gender_prob ON profiles(gender_probability);
    `);
    console.log('✅ Table and indexes ready');

    console.log('Step 3: Reading JSON file...');
    
    const profilesPath = path.join(__dirname, '../../seed_profiles.json');
    
    if (!fs.existsSync(profilesPath)) {
      console.error(`❌ File not found: ${profilesPath}`);
      process.exit(1);
    }
    
    const fileContent = JSON.parse(fs.readFileSync(profilesPath, 'utf8'));
    const profilesData = fileContent.profiles || fileContent;
    
    if (!Array.isArray(profilesData)) {
      throw new Error('Invalid JSON format');
    }
    
    console.log(`✅ Found ${profilesData.length} profiles`);

    console.log('Step 4: Inserting profiles...');
    
    let inserted = 0;
    let skipped = 0;

    for (let i = 0; i < profilesData.length; i++) {
      const profile = profilesData[i];
      
      const result = await pool.query(`
        INSERT INTO profiles (id, name, gender, gender_probability, age, age_group, 
                              country_id, country_name, country_probability, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (name) DO NOTHING
        RETURNING id;
      `, [
        uuidv7(), 
        profile.name, 
        profile.gender, 
        profile.gender_probability,
        profile.age, 
        profile.age_group, 
        profile.country_id, 
        profile.country_name,
        profile.country_probability, 
        new Date().toISOString()
      ]);
      
      if (result.rows.length > 0) {
        inserted++;
      } else {
        skipped++;
      }
      
      if ((inserted + skipped) % 100 === 0) {
        console.log(`Progress: ${inserted + skipped}/${profilesData.length} (${inserted} inserted, ${skipped} duplicates)`);
      }
    }

    console.log(`\n✅ Seed complete!`);
    console.log(`📊 Inserted: ${inserted}`);
    console.log(`📊 Skipped (duplicates): ${skipped}`);
    
    const countResult = await pool.query('SELECT COUNT(*) FROM profiles');
    console.log(`📊 Total profiles in database: ${countResult.rows[0].count}`);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error);
    await pool.end();
    process.exit(1);
  }
}

seedDatabase();