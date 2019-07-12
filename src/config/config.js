export const config = {
  entryPoint: process.env.VUE_APP_API_ENTRYPOINT,
  version: process.env.VUE_APP_VERSION,
  title: 'آنالیز۳۶۰ . دستیار دیجیتال مارکتینگ',

  progressBar: {
    color: "#288ecd",
    failedColor: "#c41621",
    height: "2px",
    thickness: "3px"
  },

  google: {
    analytics: {
      id: process.env.VUE_APP_GA_TOKEN
    }
  }
};

export default config;
