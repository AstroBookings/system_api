import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ collection: 'entry_log' })
export class EntryLogEntity {
  @PrimaryKey()
  id!: string;

  @Property()
  entityType?: string;

  @Property()
  entity_id?: number;

  @Property()
  user_id?: string;

  @Property()
  level!: string;

  @Property()
  message!: string;

  @Property()
  timestamp!: Date;

  @Property()
  data?: string;
}

export type LogLevel = 'info' | 'warning' | 'error';
