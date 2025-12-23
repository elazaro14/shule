export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] ?? "");
    return obj;
  });
}

export async function fetchCSV(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const text = await res.text();
  return parseCSV(text);
}

export function summarizeDivisions(rows) {
  const summary = { I:0, II:0, III:0, IV:0, "0":0, F:0, M:0, TOTAL:rows.length };
  rows.forEach(s => {
    const div = (s.Division || "").toUpperCase();
    if (summary.hasOwnProperty(div)) summary[div]++;
  });
  return summary;
}
