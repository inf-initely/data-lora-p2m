import type { Log } from "./core";
import {
  groupByRoundTrip,
  filterLogs,
  calcAvgRoundTrip,
  sortLogs,
  makeTable
} from "./core";

export function makeReqRepView(item: Log[]) {
  const filtered = filterLogs(item);
  const sorted = sortLogs(filtered);

  const { groups, orphans } = groupByRoundTrip(
    sorted,
    "Request sent",
    "Received reply"
  );

  const { total, len, avg } = calcAvgRoundTrip(groups);
  document.body.innerHTML = `

  <h2>Tabel Data</h2>
  ${makeTable(sorted)}

  <h2>Tabel Orphans</h2>
  ${makeTable(orphans)}
  <dl>
      <dt>Jumlah group data</dt>
      <dd>${groups.length}</dd>

      <dt>Jumlah orphans</dt>
      <dd>${orphans.length}</dd>

      <dt>Rata-rata waktu round trip</dt>
      <dd>${avg} (total: ${total}, num of round trip: ${len})</dd>
  </dl>
  `;
}
