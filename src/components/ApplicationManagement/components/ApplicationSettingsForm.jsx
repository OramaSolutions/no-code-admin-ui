import React, { useEffect, useState } from 'react';

const defaultState = {
  display_name: '',
  overall_description: '',
  status: 'inactive',
};

function ApplicationSettingsForm({ application, loading, onSubmit }) {
  const [formState, setFormState] = useState(defaultState);

  useEffect(() => {
    setFormState({
      display_name: application?.display_name || '',
      overall_description: application?.description || '',
      status: application?.status || 'inactive',
    });
  }, [application]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formState);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Application Settings</h2>
        <p className="text-sm text-slate-500">Update end-user display fields and registry visibility status.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Display Name</label>
          <input
            name="display_name"
            value={formState.display_name}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500"
            placeholder="Assembly Verification"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Overall Description</label>
          <textarea
            name="overall_description"
            value={formState.overall_description}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500"
            placeholder="Describe what this application does for end users."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select
            name="status"
            value={formState.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500"
          >
            <option value="inactive">Inactive</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !application?.id}
          className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Application'}
        </button>
      </form>
    </section>
  );
}

export default ApplicationSettingsForm;
