/* server/serverConfig.js */

const organizationConfig = {
  actuarial_science: {
    databaseName: 'actuarial_science',
    displayName: 'Actuarial Science',
    profileType: 'actuarial_science',
    formConfig: {
      major: {
        type: 'select',
        options: ['ACTSCI']
      },
      examsPassed: true
    }
  },
  data_mine: {
    databaseName: 'data_mine',
    displayName: 'Data Mine',
    profileType: 'data_mine',
    formConfig: {
      major: {
        type: 'select',
        options: ['CS', 'DS', 'STAT', 'Other']
      },
      skills: true,
      projects: true
    }
  }
};

const getOrganizationFromUrl = (url) => {
  const parts = url.split('/');
  return organizationConfig[parts[1]] ? parts[1] : 'actuarial_science';
};

const getDbUri = (organization) => {
  const dbName = organizationConfig[organization]?.databaseName || 'actuarial_science';
  return `${process.env.MONGODB_BASE_URI}/${dbName}?retryWrites=true&w=majority`;
};

const getFormConfig = (organization) => {
  return organizationConfig[organization]?.formConfig || organizationConfig.actuarial_science.formConfig;
};

const getProfileType = (organization) => {
  return organizationConfig[organization]?.profileType || 'actuarial_science';
};

module.exports = {
  organizationConfig,
  getOrganizationFromUrl,
  getDbUri,
  getFormConfig,
  getProfileType
};