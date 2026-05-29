const extractPayload = (payload) => payload?.data ?? payload ?? {};

const toArray = (value) => (Array.isArray(value) ? value : []);

const resolveActiveVersion = (component) => {
  if (!component) {
    return null;
  }

  if (component.active_version) {
    return component.active_version;
  }

  return toArray(component.versions).find(
    (version) => version?._id === component.active_version_id
  ) || null;
};

const mapVersions = (versions, activeVersionId) =>
  toArray(versions).map((version) => ({
    ...version,
    isActive: version?._id === activeVersionId,
  }));

const mapComponent = (component) => {
  if (!component?._id) {
    return null;
  }

  const activeVersion = resolveActiveVersion(component);
  const activeVersionId = component.active_version_id || activeVersion?._id || null;

  return {
    ...component,
    activeVersion,
    versions: mapVersions(component.versions, activeVersionId),
  };
};

export const normalizeRegistryStats = (payload) => {
  const data = extractPayload(payload);

  return {
    totalApplications: data.total_applications || 0,
    activeApplications: data.active_applications || 0,
    totalBuilds: data.total_builds_count || 0,
    failedBuilds: data.failed_builds_count || 0,
    totalDownloads: data.total_downloads_all_time || 0,
    totalStorageUsedBytes: data.total_storage_used_bytes || 0,
    lastUpdated: data.last_updated || null,
  };
};

export const normalizeApplicationList = (payload) => {
  const data = extractPayload(payload);
  const applications = data.applications || data.result || data.items || data;

  return toArray(applications).map((application) => ({
    ...application,
    id: application?._id,
    description: application?.metadata?.description || application?.overall_description || '',
    backendComponent: mapComponent(application?.components?.backend),
    uiComponent: mapComponent(application?.components?.ui),
  }));
};

export const normalizeApplicationDetail = (payload) => {
  const data = extractPayload(payload);
  const application = data.application || data;
  const backendComponent = mapComponent(
    data?.components?.backend || application?.components?.backend || data?.backend_component || null
  );
  const uiComponent = mapComponent(
    data?.components?.ui || application?.components?.ui || data?.ui_component || null
  );

  return {
    ...application,
    id: application?._id,
    description: application?.metadata?.description || application?.overall_description || '',
    components: {
      backend: backendComponent,
      ui: uiComponent,
    },
  };
};
