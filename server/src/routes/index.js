import { Router } from 'express';

import { login, me } from '../controllers/auth.js';

import { auth, allow } from '../middleware/auth.js';

import * as students from '../controllers/students.js';

import * as permissions from '../controllers/permissions.js';

import * as gateway from '../controllers/gateway.js';

import * as admin from '../controllers/admin.js';

const r = Router();

r.post('/auth/login', login);

r.get('/auth/me', auth, me);

// Student management

r.get(
  '/students',
  auth,
  allow('ADMIN', 'REGISTRAR'),
  students.list
);

r.post(
  '/students',
  auth,
  allow('ADMIN', 'REGISTRAR'),
  students.create
);

r.get(
  '/students/:id',
  auth,
  allow('ADMIN', 'STUDENT', 'REGISTRAR'),
  students.get
);

r.get(
  '/students/:id/qr',
  auth,
  allow('ADMIN', 'STUDENT', 'REGISTRAR'),
  students.qr
);

r.patch(
  '/students/:id',
  auth,
  allow('ADMIN', 'REGISTRAR'),
  students.update
);

r.delete(
  '/students/:id',
  auth,
  allow('ADMIN', 'REGISTRAR'),
  students.remove
);

// Permissions

r.get(
  '/permissions',
  auth,
  allow('ADMIN', 'STUDENT'),
  permissions.list
);

r.post(
  '/permissions',
  auth,
  allow('STUDENT'),
  permissions.create
);

r.post(
  '/permissions/:id/approve',
  auth,
  allow('ADMIN'),
  permissions.approve
);

r.post(
  '/permissions/:id/deny',
  auth,
  allow('ADMIN'),
  permissions.deny
);

// Gateway

r.post(
  '/gateway/verify',
  auth,
  allow('GATEWAY', 'ADMIN'),
  gateway.verify
);

r.post(
  '/gateway/exit',
  auth,
  allow('GATEWAY', 'ADMIN'),
  gateway.exit
);

r.post(
  '/gateway/entry',
  auth,
  allow('GATEWAY', 'ADMIN'),
  gateway.entry
);

r.get(
  '/gateway/recent',
  auth,
  allow('GATEWAY', 'ADMIN'),
  gateway.recent
);

// Admin

r.get(
  '/admin/dashboard',
  auth,
  allow('ADMIN'),
  admin.dashboard
);

r.get(
  '/admin/monitoring',
  auth,
  allow('ADMIN'),
  admin.monitoring
);

r.get(
  '/admin/alerts',
  auth,
  allow('ADMIN'),
  admin.alerts
);

r.patch(
  '/admin/alerts/:id/resolve',
  auth,
  allow('ADMIN'),
  admin.resolveAlert
);

r.get(
  '/admin/access-records',
  auth,
  allow('ADMIN', 'GATEWAY'),
  admin.accessRecords
);

r.get(
  '/notifications',
  auth,
  admin.notifications
);

r.patch(
  '/notifications/:id/read',
  auth,
  admin.readNotification
);

export default r;