const names = [ 'Jin', 'Hwoarang', 'Yoshimitsu', 'Eddy', 'Lei', 'Law', 'Xiaoyu', 'Paul', 'King', 'Nina' ]

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
      "pattern": names.join('|')
    }
  },
  "required": [ "id", "name" ]
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
