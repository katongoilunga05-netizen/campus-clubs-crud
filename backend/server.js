require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const supabase = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const FIELDS = ['name', 'description', 'category', 'meeting_day', 'contact_email', 'member_count'];

function validate(body) {
  if (!body.name || !String(body.name).trim()) return 'name is required';
  if (body.member_count !== undefined && body.member_count !== '' &&
      (!Number.isInteger(Number(body.member_count)) || Number(body.member_count) < 0))
    return 'member_count must be a non-negative integer';
  return null;
}
function clean(b) {
  const o = {};
  FIELDS.forEach((f) => { o[f] = f === 'member_count' ? Number(b[f] || 0) : (b[f] ?? null); });
  return o;
}
const fail = (res, error) => res.status(500).json({ error: error.message });

// GET all
app.get('/api/clubs', async (req, res) => {
  const { data, error } = await supabase.from('clubs').select('*').order('id');
  if (error) return fail(res, error);
  res.json(data);
});

// GET one
app.get('/api/clubs/:id', async (req, res) => {
  const { data, error } = await supabase.from('clubs').select('*').eq('id', req.params.id).maybeSingle();
  if (error) return fail(res, error);
  if (!data) return res.status(404).json({ error: 'Club not found' });
  res.json(data);
});

// POST create
app.post('/api/clubs', async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const { data, error } = await supabase.from('clubs').insert(clean(req.body)).select().single();
  if (error) return fail(res, error);
  res.status(201).json(data);
});

// PUT update
app.put('/api/clubs/:id', async (req, res) => {
  const err = validate(req.body);
  if (err) return res.status(400).json({ error: err });
  const { data, error } = await supabase.from('clubs').update(clean(req.body))
    .eq('id', req.params.id).select().maybeSingle();
  if (error) return fail(res, error);
  if (!data) return res.status(404).json({ error: 'Club not found' });
  res.json(data);
});

// DELETE
app.delete('/api/clubs/:id', async (req, res) => {
  const { data, error } = await supabase.from('clubs').delete().eq('id', req.params.id).select().maybeSingle();
  if (error) return fail(res, error);
  if (!data) return res.status(404).json({ error: 'Club not found' });
  res.json({ message: 'Club deleted', id: data.id });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
