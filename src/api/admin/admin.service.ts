import { EntityManager } from '@mikro-orm/mongodb';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { JobEntity } from './entities/job.entity';
import { LogEntryEntity } from './entities/log.-entry.entity';

@Injectable()
export class AdminService {
  private readonly usersCollection = 'users';
  private readonly logEntriesCollection = 'log_entries';
  private readonly jobQueueCollection = 'job_queue';

  constructor(private readonly em: EntityManager) {}

  async clearDatabase() {
    await this.clearUsers();
    await this.clearLogEntries();
    await this.clearJobQueue();
    return { message: 'Database cleared' };
  }

  async createCollections() {
    await this.createUsersCollection();
    await this.createLogEntriesCollection();
    await this.createJobQueueCollection();
    return { message: 'Collections created' };
  }

  async seedDatabase() {
    await this.seedUsers();
    await this.seedLogEntries();
    await this.seedJobQueue();
    return { message: 'Database seeded' };
  }

  private async clearUsers() {
    await this.em.getConnection().dropCollection(this.usersCollection);
  }

  private async clearLogEntries() {
    await this.em.getConnection().dropCollection(this.logEntriesCollection);
  }

  private async clearJobQueue() {
    await this.em.getConnection().dropCollection(this.jobQueueCollection);
  }

  private async createUsersCollection() {
    await this.em.getConnection().createCollection(this.usersCollection);
    await this.em.getCollection(this.usersCollection).createIndex({ id: 1 }, { unique: true });
    await this.em.getCollection(this.usersCollection).createIndex({ email: 1 }, { unique: true });
  }

  private async createLogEntriesCollection() {
    await this.em.getConnection().createCollection(this.logEntriesCollection);
    await this.em.getCollection(this.logEntriesCollection).createIndex({ id: 1 }, { unique: true });
    await this.em.getCollection(this.logEntriesCollection).createIndex({ level: 1 });
  }

  private async createJobQueueCollection() {
    await this.em.getConnection().createCollection(this.jobQueueCollection);
    await this.em.getCollection(this.jobQueueCollection).createIndex({ id: 1 }, { unique: true });
    await this.em.getCollection(this.jobQueueCollection).createIndex({ status: 1 });
  }

  private async seedUsers() {
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
    await this.em.getCollection(this.usersCollection).insertMany(users);
  }

  private async seedLogEntries() {
    const logEntries: LogEntryEntity[] = [
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
    await this.em.getCollection(this.logEntriesCollection).insertMany(logEntries);
  }

  private async seedJobQueue() {
    const jobQueue: JobEntity[] = [
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
    await this.em.getCollection(this.jobQueueCollection).insertMany(jobQueue);
  }

  private hashText(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }
}
