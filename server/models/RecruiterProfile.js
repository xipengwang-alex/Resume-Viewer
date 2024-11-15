const mongoose = require('mongoose');
//recruiterprofile is created manually in db
//all recruiter shares the same login info and profile

const recruiterProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
}, { collection: 'recruiter_profiles' });

module.exports = {
  schema: recruiterProfileSchema,
};