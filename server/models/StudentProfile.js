const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  gpa: Number,
  graduation: Number,
  major: String,
  willNeedSponsorship: String,
  sponsorshipTimeframe: String,
  opportunityType: String,
  pastInternships: String,
  examsPassed: {
    p: Boolean,
    fm: Boolean,
    ifm: Boolean,
    srm: Boolean,
    fam: Boolean,
    fams: Boolean,
    faml: Boolean,
    ltam: Boolean,
    stam: Boolean,
    altam: Boolean,
    astam: Boolean,
    pa: Boolean,
    mas1: Boolean,
    mas2: Boolean,
    exam5: Boolean,
    exam6: Boolean,
  },
  resume: {
    filePath: String,
    uploadedAt: { type: Date, default: Date.now },
  }
}, { collection: 'student_profiles' });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);