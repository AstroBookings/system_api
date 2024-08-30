const crypto = require('crypto');

function hashText(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// Users
db.users.insertMany([
  {
    id: 'usr_t1',
    email: 'john.doe@email.com',
    password_hash: hashText('Password@1'),
    name: 'John Doe',
    role: 'traveler',
  },
  {
    id: 'usr_t2',
    email: 'emma.smith@email.co.uk',
    password_hash: hashText('Password@2'),
    name: 'Emma Smith',
    role: 'traveler',
  },
  {
    id: 'usr_a1',
    email: 'info@spacex.com',
    password_hash: hashText('Password@3'),
    name: 'SpaceX Corporation',
    role: 'agency',
  },
  {
    id: 'usr_a2',
    email: 'contact@virgingalactic.com',
    password_hash: hashText('Password@4'),
    name: 'Virgin Galactic Ltd',
    role: 'agency',
  },
]);

// EntryLogs
db.entry_log.insertMany([
  {
    id: 'log_1',
    entityType: 'booking',
    entity_id: 1,
    user_id: 'usr_t1',
    level: 'info',
    message: 'Booking confirmed',
    timestamp: new Date('2025-07-20T10:00:00Z'),
    data: JSON.stringify({ bookingId: 'bkg_1', launchId: 'lnch_1' }),
  },
  {
    id: 'log_2',
    entityType: 'launch',
    entity_id: 3,
    user_id: 'usr_a1',
    level: 'info',
    message: 'Launch scheduled',
    timestamp: new Date('2026-01-01T00:00:00Z'),
    data: JSON.stringify({ launchId: 'lnch_3' }),
  },
]);

// JobsQueue
db.job_queue.insertMany([
  {
    id: 'job_1',
    job_type: 'send_notification',
    entity_type: 'booking',
    entity_id: 1,
    status: 'completed',
    created_at: new Date('2025-07-20T09:55:00Z'),
    executed_at: new Date('2025-07-20T10:00:00Z'),
    data: { notificationId: 'notif_1' },
  },
  {
    id: 'job_2',
    job_type: 'schedule_launch',
    entity_type: 'launch',
    entity_id: 3,
    status: 'pending',
    created_at: new Date('2025-12-31T23:55:00Z'),
    data: { launchId: 'lnch_3' },
  },
]);
