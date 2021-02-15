const fs = require('fs');
const configFile = `${__dirname}/../../config.json`;
const cfg = JSON.parse(fs.readFileSync(configFile));

const get = (section) => {
    if(section && cfg[section]) {
        return cfg[section];
    } else {
        console.error(`Section ${section} unknown or not set`);
    }
};

module.exports = {
    get
};