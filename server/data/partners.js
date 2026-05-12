const partners = {
  'evolve-hub': {
    name: 'Evolve Hub',
    logo: null,
    welcomeMessage: 'Welcome. Support is available to everyone.',
    mode: 'default',
  },
  'anz-bank': {
    name: 'ANZ Bank Hunter',
    logo: null,
    welcomeMessage: 'ANZ cares about the wellbeing of our community.',
    mode: 'default',
  },
  'medibank': {
    name: 'Medibank',
    logo: null,
    welcomeMessage: 'Medibank supports your mental health and wellbeing.',
    mode: 'default',
  },
  'john-hunter-hospital': {
    name: 'John Hunter Hospital',
    logo: null,
    welcomeMessage: 'You\'ve taken a brave step. Support is available.',
    mode: 'default',
  },
  'newcastle-high': {
    name: 'Newcastle High School',
    logo: null,
    welcomeMessage: 'It\'s OK to ask for help. You\'re not alone.',
    mode: 'youth',
  },
  'aged-care-demo': {
    name: 'Community Aged Care',
    logo: null,
    welcomeMessage: 'Support is available. You are not alone.',
    mode: 'elder',
  },
};

// Analytics store — aggregate scan counts only, no personal data
const analytics = {};

function recordScan(partnerCode) {
  if (!analytics[partnerCode]) {
    analytics[partnerCode] = { scans: 0, triagePaths: { crisis: 0, struggling: 0, learn: 0 } };
  }
  analytics[partnerCode].scans += 1;
}

function recordTriagePath(partnerCode, path) {
  const code = partnerCode || 'direct';
  if (!analytics[code]) {
    analytics[code] = { scans: 0, triagePaths: { crisis: 0, struggling: 0, learn: 0 } };
  }
  if (analytics[code].triagePaths[path] !== undefined) {
    analytics[code].triagePaths[path] += 1;
  }
}

function getAnalytics() {
  return analytics;
}

module.exports = { partners, recordScan, recordTriagePath, getAnalytics };
