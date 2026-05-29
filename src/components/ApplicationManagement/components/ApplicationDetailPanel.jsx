import React from 'react';
import ApplicationDetailHeader from './ApplicationDetailHeader';
import ApplicationSettingsForm from './ApplicationSettingsForm';
import ComponentPanel from './ComponentPanel';

function ApplicationDetailPanel({
  application,
  loading,
  busy,
  onBack,
  onSaveApplication,
  onActivateVersion,
  onEditVersion,
}) {
  if (!application?.id && loading) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        Loading application details...
      </section>
    );
  }

  if (!application?.id) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
        Select an application to view its details.
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <ApplicationDetailHeader application={application} onBack={onBack} />

      <ApplicationSettingsForm
        application={application}
        loading={busy}
        onSubmit={onSaveApplication}
      />

      <ComponentPanel
        component={application.components?.backend}
        busy={busy}
        onActivateVersion={onActivateVersion}
        onEditVersion={onEditVersion}
      />

      <ComponentPanel
        component={application.components?.ui}
        busy={busy}
        onActivateVersion={onActivateVersion}
        onEditVersion={onEditVersion}
      />
    </div>
  );
}

export default ApplicationDetailPanel;
