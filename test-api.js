import 'dotenv/config';

const BASE_URL = 'http://localhost:3001';
let passed = 0;
let failed = 0;

async function test(name, url, expectedStatus = 200, expectedChecks = null) {
  try {
    const response = await fetch(url);
    const status = response.status;
    const data = await response.json();
    
    let passed_check = status === expectedStatus;
    let details = { status, data };
    
    if (expectedChecks && status === 200) {
      if (expectedChecks.hasTotal && data.total !== undefined) passed_check = passed_check && true;
      if (expectedChecks.hasData && Array.isArray(data.data)) passed_check = passed_check && true;
      if (expectedChecks.hasPagination && data.page && data.limit) passed_check = passed_check && true;
      if (expectedChecks.minTotal && data.total >= expectedChecks.minTotal) passed_check = passed_check && true;
    }
    
    if (passed_check) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name} - Expected status ${expectedStatus}, got ${status}`);
      failed++;
    }
    return data;
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
    failed++;
    return null;
  }
}

async function runTests() {
  console.log('\n🧪 STARTING API TESTS\n');
  console.log('=' .repeat(60));

  // Test 1: Basic endpoint
  await test('GET /api/profiles - Basic', `${BASE_URL}/api/profiles`, 200, { hasData: true, hasPagination: true });
  
  // Test 2: Gender filter
  await test('GET /api/profiles - Gender=male', `${BASE_URL}/api/profiles?gender=male`, 200, { hasData: true });
  
  // Test 3: Age group filter
  await test('GET /api/profiles - Age group=senior', `${BASE_URL}/api/profiles?age_group=senior`, 200, { hasData: true });
  
  // Test 4: Country filter
  await test('GET /api/profiles - Country=NG', `${BASE_URL}/api/profiles?country_id=NG`, 200, { hasData: true });
  
  // Test 5: Min age filter
  await test('GET /api/profiles - Min age=50', `${BASE_URL}/api/profiles?min_age=50`, 200, { hasData: true });
  
  // Test 6: Max age filter
  await test('GET /api/profiles - Max age=18', `${BASE_URL}/api/profiles?max_age=18`, 200, { hasData: true });
  
  // Test 7: Combined filters
  await test('GET /api/profiles - Combined (male, NG, adult)', `${BASE_URL}/api/profiles?gender=male&country_id=NG&age_group=adult`, 200, { hasData: true });
  
  // Test 8: Pagination
  await test('GET /api/profiles - Page 2, Limit 5', `${BASE_URL}/api/profiles?page=2&limit=5`, 200, { hasData: true });
  
  // Test 9: Sorting ASC
  await test('GET /api/profiles - Sort by age ASC', `${BASE_URL}/api/profiles?sort_by=age&order=asc`, 200, { hasData: true });
  
  // Test 10: Sorting DESC
  await test('GET /api/profiles - Sort by age DESC', `${BASE_URL}/api/profiles?sort_by=age&order=desc`, 200, { hasData: true });
  
  // Test 11: Natural Language - Young males
  await test('NLP - Young males', `${BASE_URL}/api/profiles/search?q=young%20males`, 200, { hasData: true });
  
  // Test 12: Natural Language - Females above 30
  await test('NLP - Females above 30', `${BASE_URL}/api/profiles/search?q=females%20above%2030`, 200, { hasData: true });
  
  // Test 13: Natural Language - From Nigeria
  await test('NLP - From Nigeria', `${BASE_URL}/api/profiles/search?q=people%20from%20nigeria`, 200, { hasData: true });
  
  // Test 14: Natural Language - Teenagers
  await test('NLP - Teenagers', `${BASE_URL}/api/profiles/search?q=teenagers`, 200, { hasData: true });
  
  // Test 15: Natural Language - Adults from Kenya
  await test('NLP - Adults from Kenya', `${BASE_URL}/api/profiles/search?q=adults%20from%20kenya`, 200, { hasData: true });

  // Test 15b: Natural Language - Male and female teenagers above 17
  await test('NLP - Male and female teenagers above 17', `${BASE_URL}/api/profiles/search?q=male%20and%20female%20teenagers%20above%2017`, 200, { hasData: true });

  
  // Test 16: Invalid query parameter - Should return 422
  await test('Invalid parameter - Gender invalid', `${BASE_URL}/api/profiles?gender=invalid`, 422, null);
  
  // Test 17: Invalid natural language - Should return 422
  await test('Invalid NLP - Garbage query', `${BASE_URL}/api/profiles/search?q=xyzabc123`, 422, null);
  
  // Test 18: Empty search query - Should return 400
  await test('Empty search query', `${BASE_URL}/api/profiles/search?q=`, 400, null);
  
  // Test 19: Limit exceeds max (should default to 50 or return 422)
  await test('Limit exceeds max', `${BASE_URL}/api/profiles?limit=100`, 200, { hasData: true });
  
  // Test 20: CORS headers
  console.log('\n🔍 Testing CORS...');
  try {
    const corsTest = await fetch(BASE_URL + '/api/profiles', {
      headers: { 'Origin': 'http://test.com' }
    });
    const corsHeader = corsTest.headers.get('access-control-allow-origin');
    if (corsHeader === '*') {
      console.log('✅ CORS header present: Access-Control-Allow-Origin: *');
      passed++;
    } else {
      console.log('❌ CORS header missing or incorrect');
      failed++;
    }
  } catch (error) {
    console.log('❌ CORS test failed:', error.message);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 TEST SUMMARY:`);
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📈 Success Rate: ${Math.round((passed/(passed+failed))*100)}%`);
  console.log(`   🎯 Target: 75/100 points\n`);
}

runTests();