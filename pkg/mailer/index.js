const formData = require('form-data');
const Mailgun = require('mailgun.js');
const cfg = require('../config');
const fs = require('fs');

const send = async (to, title, data, template) => {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
        username: 'api',
        key: cfg.get('mailer').api_key,
        public_key: cfg.get('mailer').public_key
    });

    // SENDING EMAIL
    let content = parseTemplate(template, data);

    return await mg.messages.create(cfg.get('mailer').domain, {
        from: cfg.get('mailer').from_email,
        to: to,
        subject: title,
        html: content
    });
};

const parseTemplate = (template, data) => {
    let templatePath = `${__dirname}/../../email_templates/${template}.html`;
    let templateContent = fs.readFileSync(templatePath, 'utf8');
    for(let d in data) {
        let re = new RegExp(`\{\{${d}\}\}`, 'g');
        templateContent = templateContent.replace(re, data[d]);
    }

    return templateContent;
};

module.exports = {
    send
};
