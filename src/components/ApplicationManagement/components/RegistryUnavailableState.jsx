import React from 'react';

function RegistryUnavailableState({ error }) {
  return (
    <section className="rounded-3xl border border-dashed border-amber-300 bg-amber-50 p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
        Unable To Load
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-amber-950">Application list request failed</h2>
      <p className="mt-3 max-w-3xl text-sm text-amber-900/80">
        The page is now using the new `GET /admin/applications` route as its primary read source. Check the backend response shape or auth state if this request is still failing.
      </p>
      {error?.message ? (
        <p className="mt-4 rounded-2xl bg-white/80 p-4 text-sm text-amber-900">
          Latest backend response: {error.message}
        </p>
      ) : null}
    </section>
  );
}

export default RegistryUnavailableState;
