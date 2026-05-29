import React, { useEffect, useMemo, useState } from 'react';
import VersionTable from './VersionTable';
import ConfirmationModal from './ConfirmationModal';
import { toLabel } from '../utils/registryFormatters';

function ComponentPanel({
  component,
  busy,
  onActivateVersion,
  onEditVersion,
}) {
  const [selectedVersionId, setSelectedVersionId] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const successfulVersions = useMemo(
    () => (component?.versions || []).filter((version) => version.build_status === 'success'),
    [component]
  );

  useEffect(() => {
    setSelectedVersionId(component?.activeVersion?._id || '');
    setShowConfirmModal(false);
  }, [component]);

  if (!component?._id) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
        Component details are not available for this application.
      </section>
    );
  }

  return (
    <>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">
              {toLabel(component.component_type)}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">{component.component_name}</h3>
            <p className="mt-2 text-sm text-slate-600">
              Active version: {component.activeVersion?.version_tag || 'Not set'}
            </p>
            <p className="mt-1 break-all text-xs text-slate-500">
              Artifact: {component.activeVersion?.storage?.artifact_path || component.activeVersion?.storage?.docker_image || 'Not available'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:min-w-[320px]">
            <p className="text-sm font-semibold text-slate-900">Set Active Version</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Choose one successful version and confirm before applying the change.
            </p>

            <select
              value={selectedVersionId}
              onChange={(event) => setSelectedVersionId(event.target.value)}
              className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-sky-500"
            >
              <option value="">Select a version</option>
              {successfulVersions.map((version) => (
                <option key={version._id} value={version._id}>
                  {version.version_tag || 'Untitled version'}
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={busy || !selectedVersionId || selectedVersionId === component.activeVersion?._id}
              onClick={() => setShowConfirmModal(true)}
              className="mt-3 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Activate Selected Version
            </button>
          </div>
        </div>

        <div className="mt-5">
          <VersionTable
            component={component}
            busy={busy}
            onEditVersion={onEditVersion}
          />
        </div>
      </section>

      <ConfirmationModal
        open={showConfirmModal}
        busy={busy}
        title="Confirm Version Change"
        message={`Set ${successfulVersions.find((version) => version._id === selectedVersionId)?.version_tag || 'this version'} as the active ${toLabel(component.component_type).toLowerCase()} version?`}
        confirmLabel="Activate Version"
        onClose={() => setShowConfirmModal(false)}
        onConfirm={async () => {
          await onActivateVersion(component._id, selectedVersionId);
          setShowConfirmModal(false);
        }}
      />
    </>
  );
}

export default ComponentPanel;
