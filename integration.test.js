require('dotenv').config();
const { getCoordinatesByCity, getCoordinatesByZip, getCoordinates } = require('./geocode'); // Import functions

describe('Geolocation API Integration Tests', () => {
    jest.setTimeout(10000); // Set timeout to 10 seconds for API calls

    test('Should return coordinates for a valid city and state', async () => {
        const location = "Los Angeles, CA";
        const result = await getCoordinatesByCity(location);

        expect(result).toBeDefined();
        expect(result.name).toBe('Los Angeles');
        expect(result.state).toBe('California');
        expect(result.country).toBe('US');
        expect(typeof result.latitude).toBe('number');
        expect(typeof result.longitude).toBe('number');
    });

    test('Should return coordinates for a valid US ZIP code', async () => {
        const zip = "10001"; // New York ZIP code
        const result = await getCoordinatesByZip(zip);

        expect(result).toBeDefined();
        expect(result.name).toBe('New York');
        expect(result.state).toBe('New York');
        expect(result.country).toBe('US');
        expect(typeof result.latitude).toBe('number');
        expect(typeof result.longitude).toBe('number');
    });

    test('Should handle multiple location inputs (City, State & ZIP)', async () => {
        const locations = ["Los Angeles, CA", "10001", "Miami, FL", "90210"];
        const results = await getCoordinates(locations);

        expect(results).toBeInstanceOf(Array);
        expect(results.length).toBe(4);
        
        results.forEach(result => {
            expect(result).toHaveProperty('name');
            expect(result).toHaveProperty('state');
            expect(result).toHaveProperty('country', 'US');
            expect(typeof result.latitude).toBe('number');
            expect(typeof result.longitude).toBe('number');
        });
    });

    test('Should return null for an invalid city or ZIP code', async () => {
        const invalidCity = "NonExistentCity, ZZ";
        const invalidZip = "00000"; // Invalid ZIP

        const cityResult = await getCoordinatesByCity(invalidCity);
        const zipResult = await getCoordinatesByZip(invalidZip);

        expect(cityResult).toBeNull();
        expect(zipResult).toBeUndefined(); // API returns an error for invalid ZIPs
    });

    test('Should handle API errors gracefully', async () => {
        process.env.OPENWEATHER_API_KEY = "INVALID_KEY"; // Simulate API key error

        const result = await getCoordinatesByCity("New York, NY");

        expect(result).toBeUndefined(); // Should return undefined due to API error

        process.env.OPENWEATHER_API_KEY = "your_actual_api_key"; // Restore API key
    });
});