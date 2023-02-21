const fs = require('fs');

// read the MS.json file
const MSData = require('./MS.json');

// create an empty object to store the modified data
const updatedData = {};

// create an object with the sagas data
const sagas = {
    Saiyan: MSData.earth.Sagas.Saiyan.MobData,
    Android: MSData.earth.Sagas.Android.MobData,
    CellSaga: MSData.earth.Sagas.CellSaga.MobData,
    MajinBuu: MSData.earth.Sagas.MajinBuu.MobData,
    Ginyuu: MSData.namek.Sagas.Ginyuu.MobData,
    Frieza: MSData.namek.Sagas.Frieza.MobData,
};

// update the "mobdata" array for each saga
for (const key in sagas) {
    let mobData = sagas[key];
    // check if mobData is an array, if not convert it to an array
    if (!Array.isArray(mobData)) {
        mobData = Array.from(mobData);
    }
    for (const mob of mobData) {
        mob.speed = Math.floor(Math.random() * 10) + 2;
    }
    // store the updated mobdata for each saga in the updatedData object
    updatedData[key] = mobData;
}

// write the updated data to the MS.json file
fs.writeFileSync('./MS.json', JSON.stringify(updatedData));