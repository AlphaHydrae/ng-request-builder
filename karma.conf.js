module.exports = function(config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: [
      { pattern: 'base.spec.ts' },
      { pattern: 'src/**/*.ts' },
      { pattern: 'spec/**/*.ts' }
    ],
    preprocessors: {
      'spec/**/*.ts': ['karma-typescript'],
      'src/**/*.ts': ['karma-typescript']
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['Chrome']
  });
};
