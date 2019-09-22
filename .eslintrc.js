module.exports = {
  "extends": ["airbnb-base"],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 9,
    "sourceType": "module",
  },
  "env": {
    "node": true,
  },
 "rules":{
  },
  "settings": {
    "import/resolver": {
      "babel-module": {}
    }
  }
};