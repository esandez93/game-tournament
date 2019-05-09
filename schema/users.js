const user = {
  "type": "object",
  "properties": {
    "id": {
      "type": "number",
      "unique": true,
      "minimum": 1
    },
    "username": {
      "type": "string",
      "faker": "internet.userName"
    },
    "name": {
      "type": "string",
      "faker": {
        "fake": "{{name.firstName}} {{name.lastName}}"
      }
    },
    "email": {
      "type": "string",
      "faker": "internet.email"
    },
    "company": {
      "type": "string",
      "faker": "company.companyName"
    },
    "group": {
      "type": "string",
      "faker": "name.jobTitle"
    }
  },
  "required": ["id", "username", "name", "email"]
};

export default {
  "type": "array",
  "minItems": 3,
  "maxItems": 10,
  "items": user
}
