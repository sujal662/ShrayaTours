const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contactsController');

router.get('/', contactsController.getAllContacts);
router.post('/', contactsController.createContact);
router.delete('/:id', contactsController.deleteContact);

module.exports = router;
