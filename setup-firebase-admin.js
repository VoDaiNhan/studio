// Script để extract Firebase Admin credentials từ service account JSON file
// Cách dùng: node setup-firebase-admin.js path/to/serviceAccountKey.json

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Usage: node setup-firebase-admin.js <path-to-service-account-json>');
  console.log('Example: node setup-firebase-admin.js ./serviceAccountKey.json');
  process.exit(1);
}

const jsonPath = args[0];

try {
  const serviceAccount = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  console.log('\n=== Firebase Admin Credentials ===\n');
  console.log('Add these to your .env file:\n');
  console.log(`FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}`);
  console.log(`FIREBASE_PRIVATE_KEY="${serviceAccount.private_key}"`);
  console.log('\n=================================\n');
  
  // Optionally append to .env
  const envPath = path.join(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (!envContent.includes('FIREBASE_CLIENT_EMAIL=') || envContent.includes('FIREBASE_CLIENT_EMAIL=...')) {
    const newContent = envContent
      .replace(/FIREBASE_CLIENT_EMAIL=.*/g, `FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}`)
      .replace(/FIREBASE_PRIVATE_KEY=.*/g, `FIREBASE_PRIVATE_KEY="${serviceAccount.private_key}"`);
    
    fs.writeFileSync(envPath, newContent);
    console.log('✅ Updated .env file successfully!');
  } else {
    console.log('⚠️  .env already has Firebase credentials. Please update manually if needed.');
  }
  
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
