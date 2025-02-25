require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY; 
const BASE_URL = "http://api.openweathermap.org/geo/1.0/";

/**
 * Fetch coordinates by City/State
 * @param {string} location - City/State
 */
async function getCoordinatesByCity(location) {
    try {
        const response = await axios.get(`${BASE_URL}direct`, {
            params: {
                q: `${location}, US`, 
                limit: 1,
                appid: API_KEY
            }
        });

        if (response.data.length === 0) {
            console.log(`❌ No results found for: ${location}`);
            return null;
        }

        const place = response.data[0];
        return formatLocationData(place);
    } catch (error) {
        console.error(`❌ Error fetching data for ${location}:`, error.message);
    }
}

/**
 * Fetch coordinates using ZIP
 * @param {string} zip
 */
async function getCoordinatesByZip(zip) {
    try {
        const response = await axios.get(`${BASE_URL}zip`, {
            params: {
                zip: `${zip},US`,
                appid: API_KEY
            }
        });

        return formatLocationData(response.data);
    } catch (error) {
        console.error(`❌ Error fetching data for ZIP ${zip}:`, error.message);
    }
}

/**
 * Format location data for API output
 * @param {object} place 
 */
function formatLocationData(place) {
    return {
        name: place.name || place.local_names?.en || "Unknown",
        state: place.state || "N/A",
        country: place.country || "US",
        latitude: place.lat,
        longitude: place.lon
    };
}

/**
 * Main function to handle multiple locations for cities, states, and zip codes
 * @param {string[]} locations 
 */
async function getCoordinates(locations) {
    let results = [];

    for (const location of locations) {
        let data;

        if (/^\d{5}$/.test(location)) {
            data = await getCoordinatesByZip(location); 
        } else {
            data = await getCoordinatesByCity(location); 
        }

        if (data) results.push(data);
    }

    console.log("📍 Location Results:", results);
}

// Examples:
const locations = ["Savannah, GA", "31419", "Charlotte, NC", "28277"];
getCoordinates(locations);