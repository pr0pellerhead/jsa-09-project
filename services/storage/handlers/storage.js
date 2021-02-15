const fs = require('fs');
const random = require('../../../pkg/random');

const uploadFile = (req, res) => {
    const file = req.files.document;
    const maxFilesize = 5 * 1024 * 1024; // 5 MB
    const allowedTypes = [
        'image/jpeg',
        'image/gif',
        'image/png'
    ];

    if(!allowedTypes.includes(file.mimetype)) {
        return res.status(400).send('Bad Request. Filetype not allowed.');
    }
    
    if(file.size > maxFilesize) {
        return res.status(400).send('Bad Request. Filesize exceeded.');
    }

    let userDir = `${__dirname}/../../../uploads/${req.user.uid}`;

    if(!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir);
    }

    let filename = `${random.string(5)}_${file.name}`;
    file.mv(`${userDir}/${filename}`);
    res.status(201).send({filename});
};

const getFile = (req, res) => {
    let userDir = `${__dirname}/../../../uploads/${req.user.uid}`;
    let filename = req.params.file;

    if(!fs.existsSync(`${userDir}/${filename}`)) {
        return res.status(404).send('Not Found');
    }

    res.download(`${userDir}/${filename}`);
};

module.exports = {
    uploadFile,
    getFile,
};
