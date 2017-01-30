module.exports = function(config) {
  config.set({
    frameworks: [ 'mocha', 'karma-typescript' ],
    files: [
      { pattern: 'node_modules/babel-polyfill/dist/polyfill.js' },
      { pattern: 'node_modules/zone.js/dist/zone.js' },
      { pattern: 'node_modules/reflect-metadata/Reflect.js' },
      { pattern: 'src/**/*.ts' },
      { pattern: 'spec/**/*.ts' }
    ],
    preprocessors: {
      'spec/**/*.ts': [ 'karma-typescript' ],
      'src/**/*.ts': [ 'karma-typescript' ]
    },
    reporters: [ 'karma-typescript', 'mocha' ],
    browsers: process.env.TRAVIS ? [ 'PhantomJS2' ] : [ 'Chrome', 'PhantomJS2' ]
  });
};
