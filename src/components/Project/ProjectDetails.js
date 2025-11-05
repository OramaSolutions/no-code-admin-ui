import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "../NavSideWrapper";

function ProjectDetails() {
    const { state } = useLocation();
    if (!state) {
        return (
            <Layout>
                <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-700">
                        No Project Data Available
                    </h3>
                </div>
            </Layout>
        );
    }
    console.log(state)
    const {
        name,
        model,
        projectStatus,
        approvedStatus,
        status,
        versionNumber,
        project_number,
        createdAt,
        userData,
        stepData,
    } = state;

    const { step_status, current_step, overall_progress, last_sync } = stepData || {};

    const formatDate = (dateStr) =>
        dateStr ? new Date(dateStr).toLocaleString() : "N/A";

    // Status color mapping
    const statusColorMap = {
        completed: "bg-green-100 text-green-800",
        in_progress: "bg-yellow-100 text-yellow-800",
        pending: "bg-gray-200 text-gray-500",
    };

    // Helper badge component
    const StatusBadge = ({ status }) => {
        const colorClass = statusColorMap[status] || statusColorMap.pending;
        return (
            <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colorClass}`}
            >
                {status.replace("_", " ").toUpperCase()}
            </span>
        );
    };

    // Highlighting remark and application steps
    const remarkStep = step_status?.remark;
    const applicationStep = step_status?.application;

    const isRemarkCompleted = remarkStep?.status === "completed";
    const isApplicationCompleted = applicationStep?.status === "completed";

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
                <div className="mb-6">
                    <figure>
                        <figcaption>
                            <h3 className="text-2xl font-bold text-gray-900">{name} Project</h3>
                            <p className="mt-1 text-gray-700">
                                <span className="font-semibold">Model:</span> {model}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Version:</span> {versionNumber}
                            </p>
                            <p className="text-gray-700">
                                <span className="font-semibold">Project Number:</span> {project_number}
                            </p>
                        </figcaption>
                    </figure>
                    <div className="mt-4 flex flex-wrap gap-4">
                        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            Status: {projectStatus}
                        </span>
                        <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                            Approval: {approvedStatus}
                        </span>
                        <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                            Active: {status}
                        </span>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">Step Data</h4>

                    {/* Overall Progress Bar */}
                    <div className="px-4 max-w-screen-xl mx-auto">
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-5 overflow-hidden">
                            <div
                                className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                                style={{ width: `${overall_progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="space-y-4 text-gray-700">
                        {Object.entries(step_status || {}).map(([stepName, step]) => {
                            const isSpecialStep =
                                stepName === "remark" || stepName === "application";
                            const isCompleted = step.status === "completed";

                            return (
                                <div
                                    key={stepName}
                                    className={`border p-4 rounded-md shadow-sm bg-white ${isSpecialStep
                                        ? isCompleted
                                            ? "border-green-400"
                                            : "border-yellow-400"
                                        : "border-gray-300"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h5 className="font-semibold capitalize">{stepName} Step</h5>
                                        <StatusBadge status={step.status} />
                                    </div>

                                    <p>
                                        <strong>Validation Errors:</strong>{" "}
                                        {step.validation_errors.length > 0
                                            ? step.validation_errors.join(", ")
                                            : "None"}
                                    </p>
                                    <p>
                                        <strong>Last Modified:</strong> {formatDate(step.last_modified)}
                                    </p>
                                    {isSpecialStep && (
                                        <p className="mt-2 font-semibold">
                                            {stepName === "remark" &&
                                                (isCompleted
                                                    ? "Remark step has been completed."
                                                    : "Remark step is not yet completed.")}
                                            {stepName === "application" &&
                                                (isCompleted
                                                    ? "Application step has been completed."
                                                    : "Application step is not yet completed.")}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">User Info</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-gray-700">
                        <p>
                            <strong>Name:</strong> {userData?.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {userData?.email}
                        </p>
                        <p>
                            <strong>Status:</strong> {userData?.userStatus}
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjectDetails;
