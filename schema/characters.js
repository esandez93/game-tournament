const character = {
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "unique": true,
      "faker": "random.uuid"
    },
    "name": {
      "type": "string",
      "pattern": "Jin|Hwoarang|Yoshimitsu|Eddie|Lei|Law|Xiaoyu|Paul|King|Nina"
    },
    "avatar": {
      "type": "string",
      "faker": "image.avatar"
    }
  },
  "required": [ "id", "name", "avatar" ]
};

const characters = {
  "type": "array",
  "minItems": 10,
  "maxItems": 10,
  "items": character
};

export {
  character,
  characters
}
