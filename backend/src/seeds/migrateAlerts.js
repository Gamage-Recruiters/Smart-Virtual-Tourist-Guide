/**
 * One-time migration script to convert existing SecurityAlert documents
 * from the old { lat, lng } location format to GeoJSON { type: 'Point', coordinates: [lng, lat] }.
 *
 * Run with: node src/seeds/migrateAlerts.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/database');

async function migrate() {
  await connectDB();
  const collection = mongoose.connection.collection('securityalerts');

  // Find all alerts still using the old { lat, lng } format
  const alerts = await collection
    .find({ 'location.lat': { $exists: true }, 'location.type': { $exists: false } })
    .toArray();

  console.log(`Found ${alerts.length} alerts to migrate...`);

  let migrated = 0;
  for (const alert of alerts) {
    if (alert.location && typeof alert.location.lat === 'number' && typeof alert.location.lng === 'number') {
      await collection.updateOne(
        { _id: alert._id },
        {
          $set: {
            location: {
              type: 'Point',
              coordinates: [alert.location.lng, alert.location.lat],
            },
            source: alert.source || 'manual',
          },
        }
      );
      migrated++;
    }
  }

  console.log(`✅ Migrated ${migrated} alerts to GeoJSON format`);
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
