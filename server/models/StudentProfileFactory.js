/* server/models/StudentProfileFactory.js */

const mongoose = require('mongoose');
const { actuarialScienceSchema, dataMineSchema } = require('./schemas');
const { getProfileType } = require('../serverConfig');

const getStudentProfileModel = (organization, connection) => {
  const modelName = 'StudentProfile';

  if (connection.models[modelName]) {
    return connection.models[modelName];
  }

  const profileType = getProfileType(organization);
  let schemaDefinition;

  switch (profileType) {
    case 'actuarial_science':
      schemaDefinition = actuarialScienceSchema;
      break;
    case 'data_mine':
      schemaDefinition = dataMineSchema;
      break;
    default:
      throw new Error(`Invalid profile type: ${profileType}`);
  }

  const schema = new mongoose.Schema(schemaDefinition, { collection: 'student_profiles' });
  return connection.model(modelName, schema);
};

module.exports = { getStudentProfileModel };
