import React from 'react';
import { getStatusClasses, toLabel } from '../utils/registryFormatters';

function ApplicationDetailHeader({ application, onBack }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <button
        type="button"
        onClick={onBack}
        className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Back To Applications
      </button>

      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            {application.application_name || 'No technical name'}
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">
            {application.display_name || application.application_name}
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Downloads: {application.total_downloads || 0}
          </p>
        </div>

        <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(application.status)}`}>
          {toLabel(application.status || 'unknown')}
        </span>
      </div>
    </section>
  );
}

export default ApplicationDetailHeader;
