import { EntityManager } from '@mikro-orm/mongodb';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class AdminService {
  constructor(private readonly em: EntityManager) {}

  async clearDatabase() {
    await this.em.getConnection().dropCollection('users');
    await this.em.getConnection().dropCollection('entry_log');
    await this.em.getConnection().dropCollection('notifications');
    await this.em.getConnection().dropCollection('job_queue');
    return { message: 'Database cleared' };
  }

  async createCollections() {
    this.em.getConnection().createCollection('users');
    this.em.getCollection('users').createIndex({ id: 1 }, { unique: true });
    this.em.getCollection('users').createIndex({ email: 1 }, { unique: true });
    this.em.getConnection().createCollection('entry_log');
    this.em.getCollection('entry_log').createIndex({ id: 1 }, { unique: true });
    this.em.getCollection('entry_log').createIndex({ level: 1 });
    this.em.getConnection().createCollection('job_queue');
    this.em.getCollection('job_queue').createIndex({ id: 1 }, { unique: true });
    this.em.getCollection('job_queue').createIndex({ status: 1 });
    return { message: 'Collections created' };
  }

  async seedDatabase() {
    const users = [
      {
        id: 'usr_t1',
        email: 'john.doe@email.com',
        password_hash: this.hashText('Password@1'),
        name: 'John Doe',
        role: 'traveler',
      },
      {
        id: 'usr_t2',
        email: 'emma.smith@email.co.uk',
        password_hash: this.hashText('Password@2'),
        name: 'Emma Smith',
        role: 'traveler',
      },
      {
        id: 'usr_a1',
        email: 'info@spacex.com',
        password_hash: this.hashText('Password@3'),
        name: 'SpaceX Corporation',
        role: 'agency',
      },
      {
        id: 'usr_a2',
        email: 'contact@virgingalactic.com',
        password_hash: this.hashText('Password@4'),
        name: 'Virgin Galactic Ltd',
        role: 'agency',
      },
    ];
    await this.em.getCollection('users').insertMany(users);

    const entryLogs = [
      {
        id: 'log_1',
        entityType: 'booking',
        entity_id: 1,
        user_id: 'usr_t1',
        level: 'warning',
        message: 'Booking confirmed',
        timestamp: new Date('2025-07-20T10:00:00Z'),
        data: JSON.stringify({ bookingId: 'bkg_1', launchId: 'lnch_1' }),
      },
      {
        id: 'log_2',
        entityType: 'launch',
        entity_id: 3,
        user_id: 'usr_a1',
        level: 'warning',
        message: 'Launch scheduled',
        timestamp: new Date('2026-01-01T00:00:00Z'),
        data: JSON.stringify({ launchId: 'lnch_3' }),
      },
    ];

    await this.em.getCollection('entry_log').insertMany(entryLogs);

    const jobQueues = [
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
    ];

    await this.em.getCollection('job_queue').insertMany(jobQueues);

    return { message: 'Database seeded' };
  }

  private hashText(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }
}
