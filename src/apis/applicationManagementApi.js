import axiosInstance from './axiosInstance';

const REGISTRY_ADMIN_BASE = 'registry/admin';

const unwrapResponse = (response) => response?.data?.data ?? response?.data ?? {};

export const getRegistryStats = async () => {
  const response = await axiosInstance.get(`${REGISTRY_ADMIN_BASE}/stats`);
  return unwrapResponse(response);
};

export const getRegistryApplications = async () => {
  const response = await axiosInstance.get(`${REGISTRY_ADMIN_BASE}/applications`);
  return unwrapResponse(response);
};

export const getRegistryApplicationDetail = async (applicationId) => {
  const response = await axiosInstance.get(`${REGISTRY_ADMIN_BASE}/applications/${applicationId}`);
  return unwrapResponse(response);
};

export const updateRegistryApplication = async (applicationId, payload) => {
  const response = await axiosInstance.patch(`${REGISTRY_ADMIN_BASE}/applications/${applicationId}`, payload);
  return unwrapResponse(response);
};

export const updateRegistryVersion = async (versionId, payload) => {
  const response = await axiosInstance.patch(`${REGISTRY_ADMIN_BASE}/versions/${versionId}`, payload);
  return unwrapResponse(response);
};

export const activateRegistryComponentVersion = async (componentId, versionId) => {
  const response = await axiosInstance.patch(`${REGISTRY_ADMIN_BASE}/components/${componentId}/activate`, {
    version_id: versionId,
  });
  return unwrapResponse(response);
};

export const rollbackRegistryComponent = async (componentId) => {
  const response = await axiosInstance.patch(`${REGISTRY_ADMIN_BASE}/components/${componentId}/rollback`);
  return unwrapResponse(response);
};

export const activateNextRegistryComponent = async (componentId) => {
  const response = await axiosInstance.patch(`${REGISTRY_ADMIN_BASE}/components/${componentId}/activate-next`);
  return unwrapResponse(response);
};
