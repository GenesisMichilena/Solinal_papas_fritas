import { pgTable, text, varchar, timestamp, uuid, boolean, jsonb, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Tabla de usuarios
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('user').notNull(), // admin, auditor, user
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabla de documentos
export const documents = pgTable('documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  content: text('content').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // policy, procedure, evidence, etc.
  status: varchar('status', { length: 50 }).default('draft').notNull(), // draft, approved, archived
  version: integer('version').default(1).notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  approvedBy: uuid('approved_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabla de requisitos de cumplimiento
export const complianceRequirements = pgTable('compliance_requirements', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 50 }).unique().notNull(), // ISO-27001-A.5.1.1, etc.
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  standard: varchar('standard', { length: 100 }).notNull(), // ISO-27001, GDPR, etc.
  status: varchar('status', { length: 50 }).default('pending').notNull(), // pending, implemented, verified
  score: integer('score').default(0), // 0-100
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tabla de auditoría (logs de cambios)
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  action: varchar('action', { length: 100 }).notNull(), // create, update, delete, etc.
  entity: varchar('entity', { length: 100 }).notNull(), // document, user, etc.
  entityId: uuid('entity_id').notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  changes: jsonb('changes'), // JSON con los cambios
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tabla de alertas de cumplimiento
export const complianceAlerts = pgTable('compliance_alerts', {
  id: uuid('id').primaryKey().defaultRandom(),
  requirementId: uuid('requirement_id').references(() => complianceRequirements.id).notNull(),
  severity: varchar('severity', { length: 20 }).notNull(), // high, medium, low
  message: text('message').notNull(),
  resolved: boolean('resolved').default(false).notNull(),
  resolvedAt: timestamp('resolved_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relaciones
export const usersRelations = relations(users, ({ many }) => ({
  documents: many(documents),
  auditLogs: many(auditLogs),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  author: one(users, {
    fields: [documents.authorId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
