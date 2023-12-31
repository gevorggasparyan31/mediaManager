const propertiesService = require('./properties.service');
const { validationResult } = require('express-validator');
const User = require("../users/user.model");

exports.addProperty = async (req, res) => {
  try {
    const errors = validationResult(req)
    console.log("errors:  ",errors);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email, password, accountType} = req.body;
    const userId = req.user.userId;

    const user = await User.findOne({_id: userId});

    if(user.isActivated) {
      const newProperty = await propertiesService.addProperty({email, password, accountType, userId});
      res.status(201).json({message: 'Property is added', newProperty});
    }
    else {
      res.status(401).json({error: "Your account is not activated!"});
    }
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(400).json({ errors: err.array() });
    } else {
      return res.status(500).json({ error: 'Unable to add property' });
    }
  }
};

exports.getAllPropertiesByUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    const allProperties = await propertiesService.getAllProperties({userId});
    res.json(allProperties);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Unable to fetch properties'});
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const allProperties = await propertiesService.getAllProperties();
    res.json(allProperties);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Unable to fetch properties'});
  }
};

exports.updatePropertyStatus = async (req, res) => {
  try {
    const {status} = req.body;
    const propertyId = req.params.propertyId;

    const updatedProperty = await propertiesService.updatePropertyStatus(propertyId, status);

    if (updatedProperty) {
      res.status(200).json({message: 'Property status updated', updatedProperty});
    } else {
      res.status(404).json({error: 'Property not found'});
    }
  } catch (err) {
    res.status(500).json({error: 'Unable to update property status'});
  }
};
