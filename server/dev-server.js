import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { INITIAL_INMATES, INITIAL_AUDIT_LOGS } from '../src/data/mockInmates.js';

const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'crimenet_production_grade_jwt_secret_2026';

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10kb' }));

// In-Memory Data Stores for Zero-Config Local Execution
let inmatesStore = [...INITIAL_INMATES];
let auditLogsStore = [...INITIAL_AUDIT_LOGS];

const demoUsers = [
  { username: 'admin_vance', passwordHash: bcrypt.hashSync('AdminPass123!', 10), role: 'Admin' },
  { username: 'officer_blake', passwordHash: bcrypt.hashSync('OfficerPass123!', 10), role: 'Officer' },
  { username: 'warden_k', passwordHash: bcrypt.hashSync('WardenPass123!', 10), role: 'Warden' },
];
let usersStore = [...demoUsers];

// Create HTTP and WebSockets Server
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

let onlineStaff = [
  { username: 'admin_vance', role: 'Admin' },
  { username: 'officer_blake', role: 'Officer' }
];

io.on('connection', (socket) => {
  console.log(`[CrimeNet WebSocket] Client connected: ${socket.id}`);
  socket.emit('presence:update', onlineStaff);

  socket.on('disconnect', () => {
    console.log(`[CrimeNet WebSocket] Client disconnected: ${socket.id}`);
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ONLINE', system: 'APEX-9 Corrections Facility Server', timestamp: new Date().toISOString() });
});

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = usersStore.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ message: 'Invalid credentials. Check username and password.' });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.status(200).json({
    token,
    user: { username: user.username, role: user.role }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  if (usersStore.find((u) => u.username === username)) {
    return res.status(400).json({ message: 'Username already registered' });
  }

  const newUser = {
    username,
    passwordHash: bcrypt.hashSync(password, 10),
    role: role || 'Officer'
  };
  usersStore.push(newUser);

  const token = jwt.sign({ username: newUser.username, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
  res.status(201).json({
    token,
    user: { username: newUser.username, role: newUser.role }
  });
});

// Inmate Routes
app.get('/api/inmates', (req, res) => {
  const { securityTier, search } = req.query;
  let filtered = [...inmatesStore];

  if (securityTier && securityTier !== 'ALL') {
    filtered = filtered.filter((i) => i.securityTier === securityTier);
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (i) =>
        i.fullName.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.crimeCategory.toLowerCase().includes(q) ||
        i.cellBlock.toLowerCase().includes(q)
    );
  }

  res.status(200).json(filtered);
});

app.get('/api/inmates/:id', (req, res) => {
  const inmate = inmatesStore.find((i) => i.id === req.params.id);
  if (!inmate) return res.status(404).json({ message: 'Inmate record not found' });
  res.status(200).json(inmate);
});

app.post('/api/inmates', (req, res) => {
  const newInmate = {
    ...req.body,
    id: req.body.id || `CN-${Math.floor(1000 + Math.random() * 9000)}`,
    status: req.body.status || 'Active',
    admissionDate: req.body.admissionDate || new Date().toISOString().split('T')[0]
  };
  inmatesStore.unshift(newInmate);
  io.emit('inmate:created', newInmate);
  res.status(201).json(newInmate);
});

app.put('/api/inmates/:id', (req, res) => {
  const index = inmatesStore.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Inmate record not found' });
  inmatesStore[index] = { ...inmatesStore[index], ...req.body };
  io.emit('inmate:updated', inmatesStore[index]);
  res.status(200).json(inmatesStore[index]);
});

app.delete('/api/inmates/:id', (req, res) => {
  const index = inmatesStore.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Inmate record not found' });
  const deleted = inmatesStore.splice(index, 1)[0];
  io.emit('inmate:deleted', req.params.id);
  res.status(200).json({ message: `Inmate ${req.params.id} expunged`, inmate: deleted });
});

// Audit Log Routes
app.get('/api/auditlogs', (req, res) => {
  res.status(200).json(auditLogsStore);
});

app.post('/api/auditlogs', (req, res) => {
  const newLog = {
    ...req.body,
    id: req.body.id || `LOG-${Math.floor(9000 + Math.random() * 999)}`,
    timestamp: req.body.timestamp || 'Just now'
  };
  auditLogsStore.unshift(newLog);
  io.emit('auditlog:created', newLog);
  res.status(201).json(newLog);
});

// Start listening
httpServer.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(` APEX-9 Corrections & Custody Intelligence Server Running!`);
  console.log(` REST API & WebSockets Active at: http://localhost:${PORT}`);
  console.log(` Pre-configured Demo Accounts:`);
  console.log(`   - Administrator: admin_vance   / AdminPass123!`);
  console.log(`   - Custody Officer: officer_blake / OfficerPass123!`);
  console.log(`   - Facility Warden: warden_k      / WardenPass123!`);
  console.log(`================================================================`);
});
