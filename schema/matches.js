import { user } from './users';
import { character } from './characters';

const team = {
  "type": "array",
  "minItems": 1,
  "maxItems": 4,
  "uniqueItems": true,
  "items": character
}

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
