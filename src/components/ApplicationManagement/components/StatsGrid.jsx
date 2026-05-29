import React from 'react';
import { formatBytes, formatDateTime, formatNumber } from '../utils/registryFormatters';

const statItems = (stats) => [
  { label: 'Total Applications', value: formatNumber(stats?.totalApplications) },
  { label: 'Active Applications', value: formatNumber(stats?.activeApplications) },
  { label: 'Total Builds', value: formatNumber(stats?.totalBuilds) },
  { label: 'Failed Builds', value: formatNumber(stats?.failedBuilds) },
  { label: 'Downloads', value: formatNumber(stats?.totalDownloads) },
  { label: 'Storage Used', value: formatBytes(stats?.totalStorageUsedBytes) },
];

function StatsGrid({ stats, loading }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {statItems(stats).map((item) => (
        <article
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
        >
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-3 text-xl font-semibold text-slate-900">
            {loading ? '...' : item.value}
          </p>
        </article>
      ))}
      {/* <article className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm">
        <p className="text-sm text-slate-300">Last Updated</p>
        <p className="mt-3 text-lg font-semibold">
          {loading ? 'Loading...' : formatDateTime(stats?.lastUpdated)}
        </p>
      </article> */}
    </section>
  );
}

export default StatsGrid;
