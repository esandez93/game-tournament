import settings from './settings';

const user = {
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "unique": true,
      "faker": "random.uuid"
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
    "avatar": {
      "type": "string",
      "faker": "image.avatar"
    },
    "email": {
      "type": "string",
      "faker": "internet.email"
    },
    "world": {
      "type": "string",
      "faker": "world.worldName"
    },
    "group": {
      "type": "string",
      "faker": "name.jobTitle"
    },
    "settings": settings
  },
  "required": ["id", "username", "name", "avatar", "email", "world", "group", "settings"]
};

const users = {
  "type": "array",
  "minItems": 3,
  "maxItems": 10,
  "items": user
};

export {
  user,
  users
}
