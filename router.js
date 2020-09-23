const express = require('express');
const {check, validationResult} = require('express-validator');
const { getContactsByName } = require('./db/index');
const db = require('./db/index');
const {counterAddSucceded, counterAddFailed, gaugeTotalContacts} = require('./metrics');

const router = express.Router();

//Get all the contacts
router.get('/', async (req,res, next) => {
    console.log('Fetch contacts...');

    let data;

    try {
      data = await db.getContacts();
      console.log(data);

      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "An internal error occured" });
    }

});

//Add a new contact
router.post(
  "/",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Email does not have a valid format").isEmail(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors: ", errors);
      counterAddFailed.inc();
      return res.status(400).json({ errors: errors.array() });
    }

    //the fields are valid
    const { name, email } = req.body;

    //add the contact to database
    const contact = {
      name,
      email,
    };

    let data;

    try {
      data = await db.getContactsByName(name);
      if ( data.length > 0 ) {
        console.log('A contact with this name alredy exists');
        counterAddFailed.inc();
        return res.status(400).json({ msg: "A contact with this name alredy exists" });
      }

      data = await db.getContactsByEmail(email);
      if ( data.length > 0 ) {
        console.log('A contact with this email alredy exists');
        counterAddFailed.inc();
        return res.status(400).json({ msg: "A contact with this email alredy exists" });
      }

      data = await db.addContact(contact);
      console.log(data);

      counterAddSucceded.inc();

      return res.status(200).json(data);
    } catch (error) {
      console.log('Add contact failed with error: ', error);
      counterAddFailed.inc();
      return next(error);
      // return res.status(400).json({ msg: "An internal error occured" });
    }
  }
);

//Update a contact
router.put('/:id', [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Email does not have a valid format').isEmail()
],async (req,res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors: ", errors);      
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
      data = await db.updateContact(contact);
      console.log(data);

      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return next(error);
      // return res.status(400).json({ msg: "An internal error occured" });
    }
});

//Delete a contact
router.delete('/:id', async (req,res, next) => {
    //the fields are valid
    const {id} = req.params;

    try {
      await db.deleteContact(id);

      return res.status(200).json({ msg: "The contact was deleted" });
    } catch (error) {
      console.log(error);
      return next(error);
      // return res.status(400).json({ msg: "An internal error occured" });
    }
});

module.exports = router;