import React, { useEffect, useState } from 'react';

const initialState = {
  version_tag: '',
  version_description: '',
};

function VersionEditModal({ version, busy, onClose, onSave }) {
  const [formState, setFormState] = useState(initialState);

  useEffect(() => {
    setFormState({
      version_tag: version?.version_tag || '',
      version_description: version?.version_description || '',
    });
  }, [version]);

  if (!version?._id) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(version._id, formState);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Edit Version</h3>
            <p className="mt-1 text-sm text-slate-500">Update the version tag or admin-facing description.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            x
          </button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Version Tag</label>
            <input
              name="version_tag"
              value={formState.version_tag}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500"
              placeholder="v4"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Version Description</label>
            <textarea
              name="version_description"
              value={formState.version_description}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500"
              placeholder="Fixed camera latency and improved auth."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? 'Saving...' : 'Save Version'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VersionEditModal;
