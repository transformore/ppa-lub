const site = [
  {
    name: 'SKS',
    apiUrl: {
      public: 'http://ss6api.ppa-sks.net/ppa-employee-api',
      // public: 'http://103.141.244.246/api/ppa-employee-api',
      local: 'http://192.168.0.50/api/ppa-employee-api',
    },
  },
  {
    name: 'RUB',
    apiUrl: {
      public: 'http://ss6api.ppa-rub.net/ppa-employee-api',
      // public: 'http://103.141.245.202/api/ppa-employee-api',
      local: 'http://10.10.0.1/api/ppa-employee-api',
    },
  },
  {
    name: 'KJB',
    apiUrl: {
      public: 'http://ss6api.ppa-kjb.net/ppa-employee-api',
      // public: 'http://103.141.245.206/api/ppa-employee-api',
      local: 'http://172.16.11.63/api/ppa-employee-api',
    },
  },
  {
    name: 'AMM',
    apiUrl: {
      public: 'http://ss6api.amm-abp.net/ppa-employee-api',
      // public: 'http://103.141.244.74/api/ppa-employee-api',
      local: 'http://192.168.3.98/api/ppa-employee-api',
    },
  },
  {
    name: 'BIB',
    apiUrl: {
      public: 'http://ss6api.ppa-bib.net/ppa-employee-api',
      local: 'http://10.10.15.30/api/ppa-employee-api',
    },
  },

  {
    name: 'MHU',
    apiUrl: {
      // public: "http://103.141.244.86/api/ppa-employee-api",
      public: 'http://ss6api.ppa-mhu.net/ppa-employee-api',
      local: 'http://192.168.1.62/api/ppa-employee-api',
    },
  },

  {
    name: 'HO',
    apiUrl: {
      public: 'http://36.94.11.5/api/ppa-employee-api',
      local: 'http://192.168.1.222/api/ppa-employee-api',
    },
  },
  // {
  //   name: "ABN",
  //   apiUrl: {
  //     public: "http://ss6api.transformore.net/ppa-employee-api",
  //     local: "http://1.1.1.6/api/ppa-employee-api",
  //   },
  // },
];

export default site;
