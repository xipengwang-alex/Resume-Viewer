/* client/src/config.js */

export const organizationConfig = {
    actuarial_science: {
        displayName: 'Actuarial Science',
        exams: [
        { id: "p", label: "P" }, 
        { id: "fm", label: "FM" },
        { id: "ifm", label: "IFM" },
        { id: "srm", label: "SRM" },
        { id: "fam", label: "FAM" },
        { id: "fams", label: "FAM-Short Term Only" },
        { id: "faml", label: "FAM-Long Term Only" },
        //{ id: "ltam", label: "LTAM" },
        //{ id: "stam", label: "STAM" },
        { id: "altam", label: "ALTAM" },
        { id: "astam", label: "ASTAM" },
        { id: "pa", label: "PA" },
        { id: "mas1", label: "MAS1" },
        { id: "mas2", label: "MAS2" },
        { id: "exam5", label: "CAS Exam 5" },
        { id: "exam6", label: "CAS Exam 6" }
        ],
        majorOptions: ['ACTSCI']
    },
    data_mine: {
        displayName: 'Data Mine',
        majorOptions: ['CS', 'DS', 'STAT', 'Other']
    }
};

export const getOrganization = () => {
  const pathParts = window.location.pathname.split('/');
  const potentialOrg = pathParts[1];
  if (organizationConfig[potentialOrg]) {
    return potentialOrg;
  } else {
    return 'actuarial_science';
  }
};

// Base URL for auth endpoints (login, register, validateToken)
export const AUTH_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://resumes.the-examples-book.com'
  : 'http://localhost:3000';

// Base URL for organization-specific endpoints
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? `https://resumes.the-examples-book.com/${getOrganization()}`
  : `http://localhost:3000/${getOrganization()}`;

  
  export const getCurrentOrganization = () => getOrganization();