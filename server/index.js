const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/triage', require('./routes/triage'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/handoff', require('./routes/handoff'));
app.use('/api/partner', require('./routes/partner'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Evolve API listening on http://localhost:${PORT}`);
});
