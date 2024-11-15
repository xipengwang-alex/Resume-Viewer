/* server/utils/profileHelpers.js */

const { getProfileType } = require('../serverConfig');

const processProfileData = (organization, bodyData, file) => {
  const baseData = {
    firstName: bodyData.firstName,
    lastName: bodyData.lastName,
    gpa: bodyData.gpa,
    undergradYear: bodyData.undergradYear,
    graduation: bodyData.graduation,
    major: bodyData.major,
    willNeedSponsorship: bodyData.willNeedSponsorship,
    opportunityType: bodyData.opportunityType,
    pastInternships: bodyData.pastInternships,
    resume: file ? {
      filePath: `/resumes/${file.originalname}`,
    } : undefined
  };

  const profileType = getProfileType(organization);

  switch (profileType) {
    case 'actuarial_science':
      return {
        ...baseData,
        examsPassed: bodyData.examsPassed ? JSON.parse(bodyData.examsPassed) : {}
      };
    case 'data_mine':
      return {
        ...baseData,
        skills: bodyData.skills ? JSON.parse(bodyData.skills) : [],
        projects: bodyData.projects ? JSON.parse(bodyData.projects) : []
      };
    default:
      return baseData;
  }
};

module.exports = {
  processProfileData
};