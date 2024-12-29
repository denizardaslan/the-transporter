Customer will upload a json file with the following schema:

{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "session_id": {
      "type": "integer"
    },
    "session_start": {
      "type": "string",
      "format": "date-time"
    },
    "session_end": {
      "type": ["string", "null"],
      "format": "date-time"
    },
    "driverName": {
      "type": ["string", "null"]
    },
    "tyreType": {
      "type": ["string", "null"],
      "enum": ["Winter", "Summer", "All-Season", null]
    },
    "data": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "index": {
            "type": "integer"
          },
          "timestamp": {
            "type": "string",
            "format": "date-time"
          },
          "longitude": {
            "type": "number"
          },
          "latitude": {
            "type": "number"
          },
          "speed": {
            "type": "number"
          },
          "distance": {
            "type": "number"
          }
        },
        "required": ["index", "timestamp", "longitude", "latitude", "speed", "distance"]
      }
    }
  },
  "required": ["id", "session_id", "session_start", "data"]
}