import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ collection: 'job_queue' })
export class JobEntity {
  @PrimaryKey()
  id!: string;

  @Property()
  job_type!: string;

  @Property()
  entity_type!: string;

  @Property()
  entity_id!: number;

  @Property()
  status!: string;

  @Property()
  created_at!: Date;

  @Property()
  executed_at?: Date;

  @Property()
  data!: object;
}

export enum JobStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
