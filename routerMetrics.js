const express = require('express');
const db = require('./db/index');
const {register, counterRequestsTotal, gaugeTotalContacts} = require('./metrics');

const router = express.Router();

router.get('/metrics', async (req, res) => {
    //get total contacts
    try {
        const total = Number.parseInt(await db.getContactsCount());
        gaugeTotalContacts.set(total);
    } catch(err) {
        console.log(err.message);
    }

    const metrics = await register.metrics();
    console.log('Content-Type', register.contentType, ', Metrics to send:', metrics);
	res.setHeader('Content-Type', register.contentType);
	res.send(metrics);
});

module.exports = router;