const express = require('express');
const cors = require('cors');
const path = require('path');
const { PORT } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/orgs', require('./routes/orgs'));

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'staff-portal' }));

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));
app.use((req, res) => res.sendFile(path.join(publicDir, 'index.html')));

app.listen(PORT, () => {
  console.log(`Staff portal server → http://localhost:${PORT}`);
  console.log('Default login: staff@evolve.org.au / evolve2024');
});
