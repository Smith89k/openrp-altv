import * as alt from 'alt';
import { Atms, FuelStations, Hospitals } from '/client/locations/locations.mjs';

alt.log('Loaded: client->blips->bliphelper.mjs');

let sectorBlips = [];

// Used to create blips for the player to see.
export function createBlip(pos, type, color, label) {
    // x: number, y: number, z: number);
    const blip = new alt.PointBlip(pos.x, pos.y, pos.z);
    blip.shortRange = true;
    blip.sprite = type;
    blip.color = color;
    blip.name = label;
    return blip;
}

// Used to create area blips for the player to see.
export function createAreaBlip(pos, width, length, color, alpha = 100) {
    const blip = new alt.AreaBlip(pos.x, pos.y, pos.z, width, length);
    blip.color = color;
    blip.alpha = alpha;
    blip.rotation = 0;
    return blip;
}

// Used to create sector blips, these are literally area blips but are also stored in a variable
export function createSectorBlip(sector) {
    let pos = {};
    pos.x = (sector.coords.first.x + sector.coords.second.x) / 2;
    pos.y = (sector.coords.first.y + sector.coords.second.y) / 2;
    pos.z = (sector.coords.first.z + sector.coords.second.z) / 2;

    const color = sector.color ? sector.color : 4;
    const blip = createAreaBlip(pos, sector.width, sector.length, parseInt(color));
    sectorBlips.push(blip);
    return blip;
}

// Destroys and removes all sector blips
export function cleanSectorBlips() {
    sectorBlips.forEach((_, index) => {
        sectorBlips[index].destroy();
        sectorBlips.splice(index, 1);
    });
}

alt.onServer('grid:TempTurfs', sectors => {
    const turfBlips = [];
    sectors.forEach(sector => {
        const pos = {
            x: (sector.coords.first.x + sector.coords.second.x) / 2,
            y: (sector.coords.first.y + sector.coords.second.y) / 2,
            z: (sector.coords.first.z + sector.coords.second.z) / 2
        };

        const color = sector.color ? sector.color : 4;
        const blip = createBlip(pos, 79, color, 'YOUR TURF');
        turfBlips.push(blip);
    });

    alt.setTimeout(() => {
        turfBlips.forEach(turf => {
            if (turf && turf.destroy) {
                try {
                    turf.destroy();
                } catch (err) {
                    alt.log('Turf could not be deleted.');
                }
            }
        });
    }, 60000);
});

// Load ATM Blips
Atms.forEach(atm => {
    createBlip(atm, 108, 2, 'ATM');
});

FuelStations.forEach(station => {
    createBlip(station, 361, 49, 'Fuel Station');
});

Hospitals.forEach(hospital => {
    createBlip(hospital, 61, 11, 'Hospital');
});
