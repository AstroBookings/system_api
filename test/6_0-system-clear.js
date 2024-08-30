// Drop and recreate collections
db.getCollection('users').drop();
db.getCollection('notifications').drop();
db.getCollection('entry_log').drop();
db.getCollection('job_queue').drop();
