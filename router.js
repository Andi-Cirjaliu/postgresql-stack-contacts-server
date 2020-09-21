const express = require('express');
const {check, validationResult} = require('express-validator');
const axios = require('axios');
const db = require('./db/index');

const USE_DB = true;
const JSON_SERVER_URL=process.env.JSON_SERVER_URL;
console.log('JSON_SERVER_URL:', JSON_SERVER_URL);

const router = express.Router();

//Get all the contacts
router.get('/', async (req,res, next) => {
    console.log('Fetch contacts...');

    let data;

    try {
      if (USE_DB) {
        data = await db.getContacts();
      } else {
        const response = await axios.get(`${JSON_SERVER_URL}`);
        // const response = await axios.get('/contacts');
        data = response.data;
      }
      console.log(data);

      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "An internal error occured" });
    }

});

//Add a new contact
router.post('/', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email does not have a valid format').isEmail()
], async (req,res, next) => {
    const errors = validationResult(req);
    console.log("errors: ", errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //the fields are valid
    const {name, email} = req.body;

    //add the contact to database
    const contact = {
        name, email
    };

    let data;

    try {
      if (USE_DB) {
        data = await db.addContact(contact);
      } else {
        const response = await axios.post(
          `${JSON_SERVER_URL}`,
          contact,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        data = response.data;
      }
      console.log(data);

      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "An internal error occured" });
    }
});

//Update a contact
router.put('/:id', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email does not have a valid format').isEmail()
],async (req,res, next) => {
    const errors = validationResult(req);
    console.log("errors: ", errors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //the fields are valid
    const {name, email} = req.body;
    //the fields are valid
    const {id} = req.params;
    console.log('Update contact ', id, `: ${name} - ${email}`);

    const contact = {
        id, name, email
    }

    let data;

    try {
      if (USE_DB) {
        data = await db.updateContact(contact);
      } else {
        const response = await axios.put(
          `${JSON_SERVER_URL}/${id}`,
          contact,
          { headers: { "Content-Type": "application/json" } }
        );
        data = response.data;
      }
      console.log(data);

      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "An internal error occured" });
    }
});

//Delete a contact
router.delete('/:id', async (req,res, next) => {
    //the fields are valid
    const {id} = req.params;

    try {
      if (USE_DB) {
        await db.deleteContact(id);
      } else {
        await axios.delete(`${JSON_SERVER_URL}/${id}`);
      }

      return res.status(200).json({ msg: "The contact was deleted" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "An internal error occured" });
    }
});

module.exports = router;