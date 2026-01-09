import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "../NavSideWrapper";
import { getUrl } from "../../config/config";
import { useDispatch } from "react-redux";
import { getRemarkData } from "../../reduxToolkit/Slices/projectSlices";
// import ViewRemarkModal from "./ViewRemarkModal";
import LabelledStepDetails from "./steps/LabelledStepDetails";
import AugmentationStepDetails from "./steps/AugmentationStepDetails";
import DataSplitStepDetails from "./steps/DataSplitStepDetails";
import HypertuneStepDetails from "./steps/HypertuneStepDetails";
import RemarkModal from "./RemarkModal";

import {
  FiClock,
  FiUser,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiEye,
  FiArrowRight,
  FiGrid
} from "react-icons/fi";

function ProjectDetails() {
  const { state } = useLocation();
  const [remarkData, setRemarkData] = React.useState(null);
  const [loadingRemark, setLoadingRemark] = React.useState(false);
  const [showViewRemarkModal, setShowViewRemarkModal] = React.useState(false);
  const [remarkModalState, setRemarkModalState] = React.useState({
    id: "",
    projectName: "",
    model: "",
    showRemark: false,
  });
  const [datasetCount, setDatasetCount] = React.useState(0)
  const [openStep, setOpenStep] = React.useState(null);

  const dispatch = useDispatch();

  if (!state) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
          <div className="max-w-sm p-6 text-center bg-white rounded-lg shadow-sm">
            <FiAlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              No Project Data
            </h3>
            <p className="text-sm text-gray-600">
              Please select a project to view details
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const {
    name,
    model,
    projectStatus,
    approvedStatus,
    status,
    versionNumber,
    project_number,
    _id,
    createdAt,
    userData,
    stepData,
  } = state;
  const flaskUrl = getUrl(model);
  console.log('state', state)
  const fetchRemarks = async () => {
    try {
      setLoadingRemark(true);
      const res = await dispatch(
        getRemarkData({
          url: flaskUrl,
          username: userData.userName,
          task: model,
          project: name,
          version: versionNumber,
        })
      );

      if (res?.payload?.code === 200) {
        setRemarkData(res.payload);
        setShowViewRemarkModal(true);
      }
    } finally {
      setLoadingRemark(false);
    }
  };

  const { step_status, current_step, overall_progress, last_sync } = stepData || {};

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString("en-US", {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : "N/A";

  const statusColorMap = {
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    in_progress: "bg-blue-50 text-blue-700 border border-blue-200",
    pending: "bg-gray-50 text-gray-600 border border-gray-200",
  };

  const StatusBadge = ({ status }) => {
    const colorClass = statusColorMap[status] || statusColorMap.pending;
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${colorClass}`}>
        {status === "completed" && <FiCheckCircle className="w-3 h-3" />}
        {status === "in_progress" && <FiRefreshCw className="w-3 h-3 animate-spin" />}
        <span>{status.replace("_", " ")}</span>
      </div>
    );
  };
  const toggleStep = (stepName, status) => {
    if (status !== "completed") return;
    setOpenStep(prev => (prev === stepName ? null : stepName));
  };

  const remarkStep = step_status?.remark;
  const applicationStep = step_status?.application;
  const isRemarkCompleted = remarkStep?.status === "completed";

  // Calculate statistics
  const completedSteps = Object.values(step_status || {}).filter(s => s.status === 'completed').length;
  const totalSteps = Object.keys(step_status || {}).length;
  const specialStepsCompleted = [remarkStep, applicationStep].filter(s => s?.status === 'completed').length;
  const validationErrorCount = Object.values(step_status || {}).reduce((acc, step) => acc + step.validation_errors.length, 0);

  return (
    <Layout>
      <div className="p-4 bg-gray-50 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="mt-1 text-sm text-gray-600">Project Details</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FiGrid className="w-4 h-4" />
                <span>#{project_number}</span>
              </div>
            </div>

            {/* Project Metadata */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <FiFileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{model}</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <FiClock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">v{versionNumber}</span>
              </div>
              <div className="w-px h-4 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Details & Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Section */}
              <div className="p-5 bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Progress Overview</h2>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{overall_progress}%</p>
                    <p className="text-xs text-gray-500">Complete</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2 text-xs text-gray-600">
                    <span>Project completion</span>
                    <span>{overall_progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden bg-gray-200 rounded-full">
                    <div
                      className="h-full transition-all duration-500 bg-blue-600 rounded-full"
                      style={{ width: `${overall_progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Steps */}
                <div className="mb-6">
                  <h3 className="mb-4 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                    Steps ({completedSteps}/{totalSteps})
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(step_status || {}).map(([stepName, step]) => {
                      const isSpecial = stepName === "remark" || stepName === "application";

                      return (
                        <div
                          key={stepName}
                          className={`p-4 rounded-lg border ${isSpecial
                            ? step.status === "completed"
                              ? "border-emerald-200 bg-emerald-50/50"
                              : "border-amber-200 bg-amber-50/50"
                            : "border-gray-200"
                            }`}
                        >
                          {/* HEADER */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 capitalize">
                                {stepName.replace("_", " ")}
                              </span>
                              {isSpecial && (
                                <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                                  {stepName === "remark" ? "Review" : "Application"}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={step.status} />

                              <button
                                type="button"
                                onClick={() => toggleStep(stepName, step.status)}
                                className="p-1 rounded hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                disabled={step.status !== "completed"}
                                aria-expanded={openStep === stepName}
                              >
                                <svg
                                  className={`w-4 h-4 text-gray-500 transition-transform ${openStep === stepName ? "rotate-180" : ""
                                    }`}
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {/* COMMON STEP INFO */}
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Last modified</span>
                              <span className="font-medium text-gray-900">
                                {formatDate(step.last_modified)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Validation errors</span>
                              <span
                                className={`font-medium ${step.validation_errors.length > 0
                                  ? "text-red-600"
                                  : "text-emerald-600"
                                  }`}
                              >
                                {step.validation_errors.length > 0
                                  ? step.validation_errors.length
                                  : "None"}
                              </span>
                            </div>
                          </div>

                          {openStep === stepName && step.status === "completed" && (
                            <div className="mt-3">
                              {stepName === "labelled" && (
                                <LabelledStepDetails
                                  flaskUrl={flaskUrl}
                                  username={userData.userName}
                                  projectName={name}
                                  version={versionNumber}
                                  task={model}
                                  setDatasetCount={setDatasetCount}
                                />
                              )}

                              {stepName === "augmented" && (
                                <AugmentationStepDetails
                                  flaskUrl={flaskUrl}
                                  username={userData.userName}
                                  projectName={name}
                                  version={versionNumber}
                                  task={model}
                                  datasetCount={datasetCount}
                                />
                              )}

                              {stepName === "dataSplit" && (
                                <DataSplitStepDetails
                                  flaskUrl={flaskUrl}
                                  username={userData.userName}
                                  projectName={name}
                                  version={versionNumber}
                                  task={model}
                                />
                              )}

                              {stepName === "HyperTune" && (
                                <HypertuneStepDetails
                                  flaskUrl={flaskUrl}
                                  username={userData.userName}
                                  projectName={name}
                                  version={versionNumber}
                                  task={model}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* View Remarks Button */}
                {isRemarkCompleted && (
                  <button
                    onClick={fetchRemarks}
                    disabled={loadingRemark}
                    className="flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-white transition-colors bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingRemark ? (
                      <>
                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                        Loading remarks...
                      </>
                    ) : (
                      <>
                        <FiEye className="w-4 h-4" />
                        View Remarks
                        <FiArrowRight className="w-4 h-4 ml-auto" />
                      </>
                    )}
                  </button>
                )}
              </div>

           
            </div>

            {/* Right Column - User & Summary */}
            <div className="space-y-6">
               {/* Current Status */}
              <div className="p-5 bg-white rounded-lg shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Current Status</h3>
                <div className="grid grid-cols-1 gap-4 ">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="mb-1 text-sm text-gray-600">Current Step</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {current_step?.replace("_", " ") || "Not specified"}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="mb-1 text-sm text-gray-600">Last Synced</p>
                    <p className="font-medium text-gray-900">{formatDate(last_sync)}</p>
                  </div>
                </div>
              </div>
              {/* User Information */}
              <div className="p-5 bg-white rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-gray-100">
                    <FiUser className="w-5 h-5 text-gray-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Created By</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </p>
                    <p className="font-medium text-gray-900">{userData?.name}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </p>
                    <p className="font-medium text-gray-900 break-all">{userData?.email}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${userData?.userStatus === 'active' ? 'bg-emerald-500' : 'bg-gray-400'
                        }`}></div>
                      <span className="font-medium text-gray-900 capitalize">{userData?.userStatus}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="p-5 bg-white rounded-lg shadow-sm">
                <h3 className="mb-5 text-lg font-semibold text-gray-900">Summary</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-600">Steps completed</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {completedSteps}/{totalSteps}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-sm text-gray-600">Special steps</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {specialStepsCompleted}/2
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-sm text-gray-600">Validation errors</span>
                    </div>
                    <span className="font-semibold text-gray-900">{validationErrorCount}</span>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="p-5 bg-white rounded-lg shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Project Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Project</span>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {projectStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Approval</span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${approvedStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : approvedStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                      }`}>
                      {approvedStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        <RemarkModal
          show={showViewRemarkModal}
          onClose={() => setShowViewRemarkModal(false)}
          remarkData={remarkData}
          loading={loadingRemark}
          projectId={_id}
          projectName={name}
          model={model}
          userId={userData?._id}

        />
      </div>
    </Layout>
  );
}

export default ProjectDetails;