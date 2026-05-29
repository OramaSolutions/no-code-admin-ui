import React from 'react';
import ApplicationListItem from './ApplicationListItem';

function ApplicationListPanel({ applications, loading, selectedId, onSelect }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Applications</h2>
        <p className="text-sm text-slate-500">Open an application to manage details, backend, and frontend versions.</p>
      </div>

      <div className="space-y-3">
        {loading && applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            Loading registry applications...
          </div>
        ) : null}

        {!loading && applications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
            No applications are available yet.
          </div>
        ) : null}

        {applications.map((application) => (
          <ApplicationListItem
            key={application.id}
            application={application}
            isSelected={selectedId === application.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}

export default ApplicationListPanel;
