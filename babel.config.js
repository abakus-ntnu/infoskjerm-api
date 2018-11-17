module.exports = function (api) {
  const presets = [
    [
      '@babel/env',
      {
        targets: {
          node: 'current',
        },
        useBuiltIns: 'usage',
      },
    ],
  ];
  const plugins = [];

  api.cache(true);
  return {
    presets,
    plugins,
  };
};
