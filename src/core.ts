import data from "./data.json";

export type Log = typeof data.log[number];
export function groupByRoundTrip(list: Log[], head: string, tail: string) {
  const groups = [];
  let got = false;

  const orphans = [];
  const buffer = [];
  for (const item of list) {
    if (item.context.message === head) {
      orphans.push(...buffer.splice(0));
      got = true;
      buffer.push(item);
      continue;
    }
    console.log(item, got);
    if (got == false) {
      orphans.push(item);
      continue;
    }
    if (item.context.message === tail) {
      got = false;
      buffer.push(item);
      groups.push(buffer.splice(0));
      continue;
    }
    buffer.push(item);
    continue;
  }

  orphans.push(...buffer.splice(0));
  console.log(groups);
  return { groups: groups.filter((v) => v.length > 0), orphans };
}

export function filterLogs(logs: Log[]) {
  const filter = ["Reflecting the request"];
  return logs.filter((e) => filter.includes(e.context.message) == false);
}

export function sortLogs(logs: Log[]) {
  const _logs = [...logs];
  return _logs.sort((a, b) => +a.ms - +b.ms);
}

export function calcAvgRoundTrip(group: Log[][]) {
  const total = group
    .map((v) => v[v.length - 1].ms - v[0].ms)
    .reduce((a, b) => a + b);

  const len = group.length;
  return {
    total,
    len,
    avg: total / len
  };
}

export function makeTable(item: Log[]) {
  return `<table border="1">
  <thead>
    <tr>
      <td>Waktu</td>
      <td>Perangkat</td>
      <td>Aksi</td>
      <td>Data Pendukung</td>
    </tr>
  </thead>
  <tbody>
    ${item.map(
      (v) => `<tr>
      <td>
        ${v.ms}
      </td>
      <td>${v.context.from}</td>
      <td>${v.context.message}</td>
      <td>
        <details>
          <summary>Tampilkan</summary>
          ${v.context.data}
        </details>
      </td>
    </tr>
    `
    )}
  </tbody>
</table>`;
}
