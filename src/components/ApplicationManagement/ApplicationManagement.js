import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Layout from '../NavSideWrapper';
import { commomObj } from '../../utils';
import {
    activateComponentVersion,
    fetchRegistryApplicationDetail,
    fetchRegistryApplications,
    fetchRegistryStats,
    saveRegistryApplication,
    saveRegistryVersion,
} from '../../reduxToolkit/Slices/applicationManagementSlices';

import PageHeader from './components/PageHeader';
import StatsGrid from './components/StatsGrid';
import ApplicationListPanel from './components/ApplicationListPanel';
import ApplicationDetailPanel from './components/ApplicationDetailPanel';
import RegistryUnavailableState from './components/RegistryUnavailableState';
import VersionEditModal from './components/VersionEditModal';

const ApplicationManagement = () => {
    const dispatch = useDispatch();
    const {
        stats,
        applications,
        selectedApplication,
        loadingStats,
        loadingApplications,
        loadingDetail,
        mutating,
        error,
    } = useSelector((state) => state.applicationManagement);

    const [selectedId, setSelectedId] = useState(null);
    const [editingVersion, setEditingVersion] = useState(null);

    useEffect(() => {
        dispatch(fetchRegistryStats());
        dispatch(fetchRegistryApplications());
    }, [dispatch]);

    useEffect(() => {
        if (selectedId && applications.length > 0 && !applications.some((application) => application.id === selectedId)) {
            setSelectedId(null);
        }
    }, [applications, selectedId]);

    useEffect(() => {
        if (selectedId) {
            dispatch(fetchRegistryApplicationDetail(selectedId));
        }
    }, [dispatch, selectedId]);

    const selectedFromList = useMemo(
        () => applications.find((application) => application.id === selectedId) || null,
        [applications, selectedId]
    );

    const detailApplication = selectedApplication?.id === selectedId
        ? selectedApplication
        : selectedFromList;

    const refreshData = async (applicationId = selectedId) => {
        const jobs = [dispatch(fetchRegistryStats()), dispatch(fetchRegistryApplications())];

        if (applicationId) {
            jobs.push(dispatch(fetchRegistryApplicationDetail(applicationId)));
        }

        await Promise.all(jobs);
    };

    const handleSelect = (application) => {
        setSelectedId(application.id);
    };

    const handleSaveApplication = async (formData) => {
        if (!selectedId) {
            return;
        }

        try {
            await dispatch(saveRegistryApplication({
                applicationId: selectedId,
                payload: formData,
            })).unwrap();
            toast.success('Application updated successfully.', commomObj);
            await refreshData(selectedId);
        } catch (saveError) {
            toast.error(saveError?.message || 'Unable to update the application.', commomObj);
        }
    };

    const handleSaveVersion = async (versionId, payload) => {
        try {
            await dispatch(saveRegistryVersion({ versionId, payload })).unwrap();
            toast.success('Version updated successfully.', commomObj);
            setEditingVersion(null);
            await refreshData(selectedId);
        } catch (saveError) {
            toast.error(saveError?.message || 'Unable to update the version.', commomObj);
        }
    };

    const handleActivateVersion = async (componentId, versionId) => {
        try {
            await dispatch(activateComponentVersion({ componentId, versionId })).unwrap();
            toast.success('Version activated successfully.', commomObj);
            await refreshData(selectedId);
        } catch (activateError) {
            toast.error(activateError?.message || 'Unable to activate this version.', commomObj);
        }
    };

    return (
        <Layout>
            <main className="min-h-screen bg-slate-100 p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <PageHeader />
                    <StatsGrid stats={stats} loading={loadingStats} />

                    {error && applications.length === 0 && !loadingApplications ? (
                        <RegistryUnavailableState error={error} />
                    ) : selectedId ? (
                        <ApplicationDetailPanel
                            application={detailApplication}
                            loading={loadingDetail}
                            busy={mutating}
                            onBack={() => setSelectedId(null)}
                            onSaveApplication={handleSaveApplication}
                            onActivateVersion={handleActivateVersion}
                            onEditVersion={setEditingVersion}
                        />
                    ) : (
                        <section className="space-y-6">
                           
                            <ApplicationListPanel
                                applications={applications}
                                loading={loadingApplications}
                                selectedId={selectedId}
                                onSelect={handleSelect}
                            />
                        </section>
                    )}
                </div>
            </main>

            <VersionEditModal
                version={editingVersion}
                busy={mutating}
                onClose={() => setEditingVersion(null)}
                onSave={handleSaveVersion}
            />
        </Layout>
    )
}

export default ApplicationManagement
