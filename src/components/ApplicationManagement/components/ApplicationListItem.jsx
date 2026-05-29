import React from 'react';
import { getStatusClasses, toLabel } from '../utils/registryFormatters';

function ApplicationListItem({ application, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(application)}
      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
        isSelected
          ? 'border-sky-500 bg-sky-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 md:text-base">
            {application?.display_name || application?.application_name || 'Untitled application'}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
            {application?.application_name || 'No technical name'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <span className="text-xs font-medium text-slate-500">
            Downloads: {application?.total_downloads || 0}
          </span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(application?.status)}`}>
            {toLabel(application?.status || 'unknown')}
          </span>
        </div>
      </div>
    </button>
  );
}

export default ApplicationListItem;
