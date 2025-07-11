/* server/routes/exportRoutes.js */

const express = require('express');
const ExcelJS = require('exceljs');
const { getStudentProfileModel } = require('../models/StudentProfileFactory');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/excel', authMiddleware, async (req, res) => {
  if (req.organization !== 'actuarial_science') {
    return res.status(404).json({ message: 'Endpoint not found for this organization.' });
  }

  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const StudentProfile = getStudentProfileModel(req.organization, req.dbConnection);
    const profiles = await StudentProfile.find({ isHidden: false });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Student Profiles');

    worksheet.columns = [
      { header: 'Last Name', key: 'lastName', width: 20 },
      { header: 'First Name', key: 'firstName', width: 20 },
      { header: 'Year of Study', key: 'undergradYear', width: 15 },
      { header: 'Position Type', key: 'opportunityType', width: 15 },
      { header: 'Sponsorship', key: 'willNeedSponsorship', width: 15 },
      { header: 'GPA', key: 'gpa', width: 10 },
      { header: 'Graduation', key: 'graduation', width: 15 },
      { header: 'P', key: 'p', width: 10 },
      { header: 'FM', key: 'fm', width: 10 },
      { header: 'IFM', key: 'ifm', width: 10 },
      { header: 'SRM', key: 'srm', width: 10 },
      { header: 'FAM', key: 'fam', width: 10 },
      { header: 'FAM-S', key: 'fams', width: 10 },
      { header: 'FAM-L', key: 'faml', width: 10 },
      { header: 'ALTAM', key: 'altam', width: 10 },
      { header: 'ASTAM', key: 'astam', width: 10 },
      { header: 'PA', key: 'pa', width: 10 },
      { header: 'MAS-I', key: 'mas1', width: 10 },
      { header: 'MAS-II', key: 'mas2', width: 10 },
      { header: 'Exam 5', key: 'exam5', width: 10 },
      { header: 'Exam 6', key: 'exam6', width: 10 },
      { header: 'Resume Link', key: 'resumeLink', width: 70 },
    ];

    profiles.forEach(student => {
      const row = {
        lastName: student.lastName,
        firstName: student.firstName,
        undergradYear: student.undergradYear,
        opportunityType: student.opportunityType,
        willNeedSponsorship: student.willNeedSponsorship,
        gpa: student.gpa,
        graduation: student.graduation,
      };

      if (student.examsPassed) {
        row.p = student.examsPassed.p || false;
        row.fm = student.examsPassed.fm || false;
        row.ifm = student.examsPassed.ifm || false;
        row.srm = student.examsPassed.srm || false;
        row.fam = student.examsPassed.fam || false;
        row.fams = student.examsPassed.fams || false;
        row.faml = student.examsPassed.faml || false;
        row.altam = student.examsPassed.altam || false;
        row.astam = student.examsPassed.astam || false;
        row.pa = student.examsPassed.pa || false;
        row.mas1 = student.examsPassed.mas1 || false;
        row.mas2 = student.examsPassed.mas2 || false;
        row.exam5 = student.examsPassed.exam5 || false;
        row.exam6 = student.examsPassed.exam6 || false;
      }
      
      if (student.resume && student.resume.filePath) {
        row.resumeLink = `${process.env.API_BASE_URL}${student.resume.filePath}`;
      } else {
        row.resumeLink = 'No resume uploaded';
      }

      worksheet.addRow(row);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="student_profiles_actuarial_science.xlsx"`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Failed to export Excel file:', error);
    res.status(500).send('Error generating Excel file');
  }
});

module.exports = router;
