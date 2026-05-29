import React from 'react';
import { formatDateTime, getStatusClasses, toLabel } from '../utils/registryFormatters';

function VersionTable({ component, onEditVersion }) {
  const versions = component?.versions || [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Version</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Build</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Description</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Created</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Downloads</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-600">Edit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {versions.map((version) => (
              <tr key={version._id} className={version.isActive ? 'bg-emerald-50/60' : ''}>
                <td className="px-4 py-3 align-top flex items-center gap-1">
                  <div className="font-medium text-slate-900">{version.version_tag || 'Untitled'}</div>
                  {version.isActive ? (
                    <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                      Active
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3 align-top">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(version.build_status)}`}>
                    {toLabel(version.build_status || 'unknown')}
                  </span>
                  {version.failure_reason ? (
                    <p className="mt-2 max-w-xs text-xs text-rose-600">{version.failure_reason}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 align-top text-slate-600">
                  {version.version_description || 'No description'}
                </td>
                <td className="px-4 py-3 align-top text-slate-600">{formatDateTime(version.created_at)}</td>
                <td className="px-4 py-3 align-top text-slate-600">{version.download_count || 0}</td>
                <td className="px-4 py-3 align-top">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEditVersion(version)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {versions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-sm text-slate-500">
                  No versions available for this component.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VersionTable;
