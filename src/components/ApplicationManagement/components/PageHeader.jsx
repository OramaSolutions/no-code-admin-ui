import React from 'react';

function PageHeader() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-600">
          Registry Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Application Management</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Review application health, update metadata, and manage active backend or UI versions from one place.
        </p>
      </div>
    </div>
  );
}

export default PageHeader;
