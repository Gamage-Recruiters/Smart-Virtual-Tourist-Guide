const fs = require("fs");
const path = require("path");
const Region = require("../models/Region");

/**
 * Database Seeder for Regions
 * 
 * Description:
 * This script runs automatically when the server starts.
 * It checks if the geographical boundaries (Regions) are already saved in the database.
 * If the database is empty, it reads the local GeoJSON file and inserts the data.
 */
const seedRegions = async () => {
  try {
    // 1. Check how many region documents currently exist in the database
    const count = await Region.countDocuments();

    // If regions are already loaded, skip the seeding process to prevent duplicates
    if (count > 0) {
      console.log("  Regions already exist in database. Skipping auto-seed.");
      return;
    }

    console.log(
      " Regions collection is empty. Starting auto-seed process...",
    );

    // 2. Define the exact path to the GeoJSON data file
    const filePath = path.join(__dirname, "../../data/gadm41_LKA_2.json");

    // Safety Check: Stop the process if the JSON file is missing
    if (!fs.existsSync(filePath)) {
      console.error("⚠️  GeoJSON file not found at:", filePath);
      return;
    }

    // 3. Read the file content and convert it into a JavaScript object
    const rawData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(rawData);

    // 4. Extract and format only the necessary fields to match our Region schema
    const regions = data.features.map((feature) => ({
      name: feature.properties.NAME_2,       // Divisional Secretariat name
      district: feature.properties.NAME_1,   // District name
      geometry: feature.geometry,            // Polygon/MultiPolygon coordinates
    }));

    // 5. Bulk insert all formatted regions into the MongoDB collection at once (High performance)
    await Region.insertMany(regions);

    console.log(
      ` Successfully seeded ${regions.length} regions to the database!`,
    );
  } catch (error) {
    // Catch and log any unexpected errors during file reading or database insertion
    console.error(" Error during auto-seeding:", error.message);
  }
};

module.exports = seedRegions;