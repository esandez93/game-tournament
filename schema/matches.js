import { user } from './users';
import { character } from './characters';

let teamCharacter = character;
teamCharacter.properties.alive = {
  "type": "boolean",
  "faker": "random.boolean"
};
teamCharacter.required.push('alive');

const team = {
  "type": "array",
  "minItems": 1,
  "maxItems": 4,
  "uniqueItems": true,
  "items": teamCharacter
};

const player = {
  "type": "object",
  "properties": {
    "user": user,
    "team": team,
  },
  "required": ["user", "team"]
};

const match = {
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "unique": true,
      "faker": "random.uuid"
    },
    "player1": player,
    "player2": player,
    "blindPick": {
      "type": "boolean",
      "faker": "random.boolean"
    },
    "date": {
      "type": "string",
      "faker": "date.recent"
    },
    "result": {
      "type": "number",
      "pattern": "1|2"
    }
  },
  "required": [ "id", "player1", "player2", "blindPick", "date" ]
};

const matches = {
  "type": "array",
  "minItems": 3,
  "maxItems": 10,
  "items": match
};

export {
  match,
  matches
}
