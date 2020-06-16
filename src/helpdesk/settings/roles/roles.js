export const acl = {
  //general rules
  login: false,
  testSections: false,
  mailViaComment: false,
  vykazy: false,
  publicFilters: false,
  addProjects: false,
  viewVykaz: false,
  viewRozpocet: false,

  //settings access
  users: false,
  companies: false,
  pausals: false,
  projects: false,
  statuses: false,
  units: false,
  prices: false,
  suppliers: false,
  tags: false,
  invoices: false,
  roles: false,
  types: false,
  tripTypes: false,
  imaps: false,
  smtps: false,
}

export default [
  {
    id: '0',
    title: 'Guest',
    acl,
  },
  {
    id: '1',
    title: 'User',
    acl:{
      ...acl,
      login: true,
      viewVykaz: true,
    },
  },
  {
    id: '2',
    title: 'Agent',
    acl:{
      ...acl,
      login: true,
      viewVykaz: true,
      testSections: true,
      mailViaComment: true,
      addProjects: true,
      tags: true,
      users: true,
      companies: true,
    },
  },
  {
    id: '3',
    title: 'Manager',
    acl:{
      ...acl,
      login: true,
      viewVykaz: true,
      testSections: true,
      mailViaComment: true,
      addProjects: true,
      vykazy: true,

      tags: true,
      users: true,
      companies: true,
    },
  },
  {
    id: '4',
    title: 'Admin',
    acl:{
      login: true,
      testSections: true,
      mailViaComment: true,
      vykazy: true,
      publicFilters: true,
      addProjects: true,
      viewVykaz: true,
      viewRozpocet: true,

      //settings access
      users: true,
      companies: true,
      pausals: true,
      projects: true,
      statuses: true,
      units: true,
      prices: true,
      suppliers: true,
      tags: true,
      invoices: true,
      roles: true,
      types: true,
      tripTypes: true,
      imaps: true,
      smtps: true,
    },
  },
];
