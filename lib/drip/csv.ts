/** A small CSV reader for contact uploads: quoted fields, commas and newlines in quotes, BOM, CRLF. */

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const s = text.replace(/^﻿/, '');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (quoted) {
      if (ch === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && s[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((f) => f.trim() !== '')) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((f) => f.trim() !== '')) rows.push(row);
  return rows;
}

export type ContactRow = { email: string; first_name: string; last_name: string; company: string; title: string };

const norm = (h: string) => h.toLowerCase().replace(/[^a-z]/g, '');
const FIELDS: Record<keyof ContactRow, string[]> = {
  email: ['email', 'emailaddress', 'workemail', 'mail'],
  first_name: ['firstname', 'first', 'givenname', 'fname'],
  last_name: ['lastname', 'last', 'surname', 'familyname', 'lname'],
  company: ['company', 'companyname', 'organization', 'organisation', 'account', 'employer'],
  title: ['title', 'jobtitle', 'role', 'position'],
};

/** Maps the header row to fields by common names; a lone "name" column is split into first and last. */
export function toContacts(rows: string[][]): { contacts: ContactRow[]; columns: string[]; missingEmail: boolean } {
  if (!rows.length) return { contacts: [], columns: [], missingEmail: true };
  const head = rows[0].map(norm);
  const col = (f: keyof ContactRow) => head.findIndex((h) => FIELDS[f].includes(h));
  const idx = { email: col('email'), first_name: col('first_name'), last_name: col('last_name'), company: col('company'), title: col('title') };
  const nameCol = head.findIndex((h) => h === 'name' || h === 'fullname');
  if (idx.email < 0) return { contacts: [], columns: rows[0], missingEmail: true };
  const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? '').trim() : '');
  const contacts = rows.slice(1).map((r) => {
    let first = get(r, idx.first_name);
    let last = get(r, idx.last_name);
    if (!first && !last && nameCol >= 0) {
      const parts = get(r, nameCol).split(/\s+/);
      first = parts.shift() ?? '';
      last = parts.join(' ');
    }
    return { email: get(r, idx.email).toLowerCase(), first_name: first, last_name: last, company: get(r, idx.company), title: get(r, idx.title) };
  });
  return { contacts, columns: rows[0], missingEmail: false };
}
