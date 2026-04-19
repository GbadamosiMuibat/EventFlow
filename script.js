// EventFlow Core JS 

const EF = {
  getEvents()             { return JSON.parse(localStorage.getItem('ef_events') || '[]'); },
  saveEvents(events)      { localStorage.setItem('ef_events', JSON.stringify(events)); },
  getEvent(id)            { return this.getEvents().find(e => e.id === id) || null; },
  getAttendees(eventId)   { return JSON.parse(localStorage.getItem('ef_att_' + eventId) || '[]'); },
  saveAttendees(id, list) { localStorage.setItem('ef_att_' + id, JSON.stringify(list)); },

  addAttendee(eventId, data) {
    const list = this.getAttendees(eventId);
    list.push({ ...data, _id: Date.now().toString(), _ts: new Date().toISOString() });
    this.saveAttendees(eventId, list);
    const events = this.getEvents();
    const idx = events.findIndex(e => e.id === eventId);
    if (idx !== -1) { events[idx].count = list.length; this.saveEvents(events); }
    return list.length;
  },

  createEvent(data) {
    const events = this.getEvents();
    const ev = { ...data, id: Date.now().toString(), count: 0, createdAt: new Date().toISOString() };
    events.unshift(ev);
    this.saveEvents(events);
    return ev;
  },

  updateEvent(id, data) {
    const events = this.getEvents();
    const idx = events.findIndex(e => e.id === id);
    if (idx !== -1) { events[idx] = { ...events[idx], ...data }; this.saveEvents(events); }
  },

  deleteEvent(id) {
    this.saveEvents(this.getEvents().filter(e => e.id !== id));
    localStorage.removeItem('ef_att_' + id);
  },

  getUrlParam(key) { return new URLSearchParams(window.location.search).get(key); },

  getBaseURL() {
    const l = window.location;
    return l.protocol + '//' + l.host + l.pathname.replace(/[^/]*$/, '');
  },
  getEventURL(id) { return this.getBaseURL() + 'event.html?id=' + id; },
  getAdminURL(id) { return this.getBaseURL() + 'admin.html?id=' + id; },

  async copy(text) {
    try { await navigator.clipboard.writeText(text); this.toast('Copied to clipboard!', 'success'); }
    catch { this.toast('Could not copy', 'error'); }
  },

  toast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast' + (type === 'success' ? ' success' : type === 'error' ? ' error' : '');
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    t.innerHTML = '<span>' + (icons[type] || 'ℹ') + '</span> ' + msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  },

  exportCSV(eventId) {
    const event = this.getEvent(eventId);
    const list  = this.getAttendees(eventId);
    if (!list.length) { this.toast('No attendees to export', 'error'); return; }
    const fields  = event.fields || [];
    const headers = [...fields.map(f => f.label), 'Checked In'];
    const rows    = list.map(a => {
      const row = fields.map(f => a[f.key] || '');
      row.push(new Date(a._ts).toLocaleString());
      return row;
    });
    const esc = v => '"' + String(v).replace(/"/g, '""') + '"';
    const csv = [headers, ...rows].map(r => r.map(esc).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = event.name.replace(/[^a-z0-9]/gi, '_') + '_attendees.csv';
    a.click(); URL.revokeObjectURL(url);
    this.toast('Downloaded!', 'success');
  }
};

// Preset fields
const PRESET_FIELDS = [
  { key: 'name',       label: 'Full Name',      type: 'text',   required: true  },
  { key: 'email',      label: 'Email Address',  type: 'email',  required: false },
  { key: 'phone',      label: 'Phone Number',   type: 'tel',    required: false },
  { key: 'company',    label: 'Company / Org',  type: 'text',   required: false },
  { key: 'title',      label: 'Job Title',      type: 'text',   required: false },
  { key: 'department', label: 'Department',     type: 'text',   required: false },
  { key: 'city',       label: 'City',           type: 'text',   required: false },
  { key: 'ticket',     label: 'Ticket / Reg #', type: 'text',   required: false },
];

// Shared escape helper used across all pages
function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = String(s || '');
  return d.innerHTML;
}