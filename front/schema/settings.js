export default {
  "type": "object",
  "properties": {
    "theme": {
      "type": "string",
      "pattern": "defaultDark|defaultLight"
    },
    "locale": {
      "type": "string",
      "pattern": "es|en"
    }
  },
  "required": ["theme", "locale"]
};
