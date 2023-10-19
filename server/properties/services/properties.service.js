const Property = require('../models/properties.model');
const bcrypt = require("bcrypt");

exports.addCredentials = async ({ email, password, userId, status }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const tumblrCredential = new Property({
        email,
        password: hashedPassword,
        userId,
        status
      //  status: //unstarted -> in-progress -> completed
    });
    return tumblrCredential.save();
}

//get by query