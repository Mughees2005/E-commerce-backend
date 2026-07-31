const { DeliveryArea } = require('../../database/models/index');

async function seedDeliveryAreas() {
    console.log('Seeding delivery areas...');
    
    const areas = [
        // === Rs. 150 Zone ===
        { area_name: 'Scheme 33 (Gulzar-e-Hijri)', delivery_charge: 150 },
        
        // === Rs. 200 Zone ===
        { area_name: 'Gulshan-e-Iqbal', delivery_charge: 200 },
        { area_name: 'Gulistan-e-Johar', delivery_charge: 200 },
        { area_name: 'Safoora Town / Safoora Goth', delivery_charge: 200 },
        { area_name: 'PECHS / Tariq Road', delivery_charge: 200 },
        { area_name: 'Bahadurabad', delivery_charge: 200 },
        { area_name: 'KDA Scheme 1', delivery_charge: 200 },
        { area_name: 'Sohrab Goth', delivery_charge: 200 },
        { area_name: 'Federal B Area / Ancholi', delivery_charge: 200 },
        { area_name: 'Chanesar Town / Mehmoodabad', delivery_charge: 200 },
        { area_name: 'Jamshed Town / Soldier Bazar / Garden', delivery_charge: 200 },
        { area_name: 'Liaquatabad', delivery_charge: 200 },
        { area_name: 'Gulberg Town / Water Pump', delivery_charge: 200 },
        { area_name: 'Nazimabad', delivery_charge: 200 },
        { area_name: 'North Nazimabad', delivery_charge: 200 },
        { area_name: 'Clifton & DHA (Except Block 8)', delivery_charge: 200 },
        { area_name: 'Saddar / Burns Road', delivery_charge: 200 },
        { area_name: 'Lyari', delivery_charge: 200 },
        { area_name: 'Malir Town / Model Colony', delivery_charge: 200 },
        { area_name: 'Pak Colony (SITE)', delivery_charge: 200 },
        
        // === Rs. 250 Zone ===
        { area_name: 'New Karachi / North Karachi', delivery_charge: 250 },
        { area_name: 'DHA Block 8', delivery_charge: 250 },
        { area_name: 'Malir Cantt', delivery_charge: 250 },
        { area_name: 'Khokhrapar', delivery_charge: 250 },
        { area_name: 'Korangi Town / Korangi Industrial Area', delivery_charge: 250 },
        { area_name: 'Landhi Town / Quaidabad', delivery_charge: 250 },
        { area_name: 'Shah Faisal Town', delivery_charge: 250 },
        { area_name: 'Banaras (SITE)', delivery_charge: 250 },
        { area_name: 'Orangi Town', delivery_charge: 250 },
        { area_name: 'Mominabad Town', delivery_charge: 250 },
        { area_name: 'Baldia Town', delivery_charge: 250 },
        
        // === Rs. 300 Zone ===
        { area_name: 'Gadap Town / Super Highway', delivery_charge: 300 },
        { area_name: 'Gulshan-e-Maymar', delivery_charge: 300 },
        { area_name: 'Ibrahim Hyderi', delivery_charge: 300 },
        { area_name: 'Bin Qasim / Gulshan-e-Hadid / Steel Town', delivery_charge: 300 },
        { area_name: 'Mauripur & Keamari Town', delivery_charge: 300 },
        { area_name: 'Manghopir Town', delivery_charge: 300 },
        { area_name: 'Moriro Mirbahar Town', delivery_charge: 300 },
        { area_name: 'Hawksbay / West Wharf', delivery_charge: 300 },
        { area_name: 'Bahria Town Karachi', delivery_charge: 300 }
    ];

    await DeliveryArea.bulkCreate(areas, {
        ignoreDuplicates: true
    });

    console.log('Delivery areas seeded successfully');
}

module.exports = seedDeliveryAreas;