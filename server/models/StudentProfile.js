const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  gpa: Number,
  undergradYear: { type: String, enum: ['Freshman', 'Sophomore', 'Junior', 'Senior'] },
  graduation: String,
  major: String,
  willNeedSponsorship: String,
  //sponsorshipTimeframe: String,
  opportunityType: String,
  pastInternships: String,
  examsPassed: {
    p: { type: Boolean, default: false },
    fm: { type: Boolean, default: false },
    ifm: { type: Boolean, default: false },
    srm: { type: Boolean, default: false },
    fam: { type: Boolean, default: false },
    fams: { type: Boolean, default: false },
    faml: { type: Boolean, default: false },
    ltam: { type: Boolean, default: false },
    stam: { type: Boolean, default: false },
    altam: { type: Boolean, default: false },
    astam: { type: Boolean, default: false },
    pa: { type: Boolean, default: false },
    mas1: { type: Boolean, default: false },
    mas2: { type: Boolean, default: false },
    exam5: { type: Boolean, default: false },
    exam6: { type: Boolean, default: false },
  },
  resume: {
    filePath: String,
    uploadedAt: { type: Date, default: Date.now }
  }
}, { collection: 'student_profiles' });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);