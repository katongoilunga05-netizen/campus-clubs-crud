// If you open index.html directly from disk, talk to the local API.
// When served by the Express server (or deployed together), use same origin.
const API_BASE = location.protocol === 'file:' ? 'http://localhost:3000' : '';
const API = API_BASE + '/api/clubs';

const $ = (id) => document.getElementById(id);
const fields = ['name', 'description', 'category', 'meeting_day', 'contact_email', 'member_count'];

function show(text, error = false) {
  const m = $('msg');
  m.textContent = text;
  m.style.color = error ? '#dc2626' : '#16a34a';
  setTimeout(() => (m.textContent = ''), 3000);
}

async function request(url, options) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function loadClubs() {
  try {
    const clubs = await request(API);
    const tbody = $('rows');
    tbody.innerHTML = '';
    clubs.forEach((c) => {
      const tr = document.createElement('tr');
      [c.id, c.name, c.category, c.meeting_day, c.contact_email, c.member_count, c.updated_at]
        .forEach((v) => { const td = document.createElement('td'); td.textContent = v ?? ''; tr.appendChild(td); });
      const td = document.createElement('td');
      td.className = 'actions';
      const e = document.createElement('button'); e.textContent = 'Edit'; e.className = 'edit';
      e.onclick = () => startEdit(c);
      const d = document.createElement('button'); d.textContent = 'Delete'; d.className = 'del';
      d.onclick = () => removeClub(c.id);
      td.append(e, d); tr.appendChild(td); tbody.appendChild(tr);
    });
  } catch (err) { show(err.message, true); }
}

function startEdit(c) {
  $('id').value = c.id;
  fields.forEach((f) => ($(f).value = c[f] ?? ''));
  $('formTitle').textContent = 'Edit club #' + c.id;
  $('cancelBtn').style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetForm() {
  $('clubForm').reset();
  $('id').value = '';
  $('formTitle').textContent = 'Add a club';
  $('cancelBtn').style.display = 'none';
}

async function removeClub(id) {
  if (!confirm('Delete this club?')) return;
  try { await request(`${API}/${id}`, { method: 'DELETE' }); show('Club deleted'); loadClubs(); }
  catch (err) { show(err.message, true); }
}

$('clubForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {};
  fields.forEach((f) => (body[f] = $(f).value));
  const id = $('id').value;
  try {
    await request(id ? `${API}/${id}` : API, { method: id ? 'PUT' : 'POST', body: JSON.stringify(body) });
    show(id ? 'Club updated' : 'Club created');
    resetForm(); loadClubs();
  } catch (err) { show(err.message, true); }
});
$('cancelBtn').onclick = resetForm;

loadClubs();
