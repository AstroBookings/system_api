// Users Collection
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id', 'email', 'password_hash', 'name', 'role'],
      properties: {
        id: { bsonType: 'string', description: 'must be an string and is required' },
        email: { bsonType: 'string', description: 'must be a string and is required' },
        password_hash: { bsonType: 'string', description: 'must be a string and is required' },
        name: { bsonType: 'string', description: 'must be a string and is required' },
        role: { enum: ['admin', 'agency', 'traveler'], description: 'must be one of the enum values and is required' },
      },
    },
  },
});
db.users.createIndex({ id: 1 }, { unique: true });
db.users.createIndex({ email: 1 }, { unique: true });

// EntryLogs Collection
db.createCollection('entry_log', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id', 'level', 'message', 'timestamp'],
      properties: {
        id: { bsonType: 'string', description: 'must be an string and is required' },
        entityType: { bsonType: 'string', description: 'must be a string' },
        entity_id: { bsonType: 'int', description: 'must be an integer' },
        user_id: { bsonType: 'int', description: 'must be an integer' },
        level: { enum: ['info', 'warning', 'error'], description: 'must be one of the enum values and is required' },
        message: { bsonType: 'string', description: 'must be a string ' },
        timestamp: { bsonType: 'date', description: 'must be a date and is required' },
        data: { bsonType: 'string', description: 'must be a string' },
      },
    },
  },
});
db.entry_log.createIndex({ id: 1 }, { unique: true });
db.entry_log.createIndex({ level: 1 });

// JobsQueue Collection
db.createCollection('job_queue', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id', 'job_type', 'entity_type', 'entity_id', 'status', 'created_at', 'data'],
      properties: {
        id: { bsonType: 'string', description: 'must be an string and is required' },
        job_type: { bsonType: 'string', description: 'must be a string and is required' },
        entity_type: { bsonType: 'string', description: 'must be a string and is required' },
        entity_id: { bsonType: 'int', description: 'must be an integer and is required' },
        status: {
          enum: ['pending', 'completed', 'failed'],
          description: 'must be one of the enum values and is required',
        },
        created_at: { bsonType: 'date', description: 'must be a date and is required' },
        executed_at: { bsonType: 'date', description: 'must be a date' },
        data: { bsonType: 'object', description: 'must be an object and is required' },
      },
    },
  },
});
db.job_queue.createIndex({ id: 1 }, { unique: true });
db.job_queue.createIndex({ status: 1 });
