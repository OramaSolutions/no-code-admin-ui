import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addRemark, projectList } from '../../reduxToolkit/Slices/projectSlices';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    FiX,
    FiMessageSquare,
    FiPaperclip,
    FiDownload,
    FiPlus,
    FiSave,
    FiEye,
    FiEyeOff,
    FiLoader,
    FiClock,
    FiUser,
    FiFileText,
    FiChevronRight
} from 'react-icons/fi';

const initialState = {
    visible: false,
    notes: "",
    errors: {},
    loading: false,
};

function CombinedRemarkModal({
    show,
    onClose,
    remarkData,
    loading,
    projectId,
    projectName,
    model,
    userId
}) {

    const dispatch = useDispatch();
    const [adminRemark, setAdminRemark] = useState(initialState);
    const { visible, notes, errors, loading: saving } = adminRemark;

    if (!show) return null;

    const parseRemarkStrings = (remarks = []) => {
        let observation = "";
        let scopeOfImprovement = "";
        let numOfTries = "";

        remarks.forEach((item) => {
            if (item.includes("Observation:")) {
                observation = item.split("Observation:")[1]?.trim() || "";
            }
            if (item.includes("Scope of Improvement:")) {
                scopeOfImprovement = item.split("Scope of Improvement:")[1]?.trim() || "";
            }
            if (item.includes("Number of Tries:")) {
                numOfTries = item.split("Number of Tries:")[1]?.trim() || "";
            }
        });

        return { observation, scopeOfImprovement, numOfTries };
    };

    const { observation, scopeOfImprovement, numOfTries } = parseRemarkStrings(remarkData?.remarks || []);

    const ckeditorhandler = (content) => {
        setAdminRemark({ ...adminRemark, notes: content });
    };

    const handleValidation = () => {
        let formIsValid = true;
        let error = {};
        if (!notes?.trim()) {
            formIsValid = false;
            error.nameError = "Notes are required";
        }
        setAdminRemark({ ...adminRemark, errors: error });
        return formIsValid;
    };

    const saveHandler = async () => {
        let formValid = handleValidation();
        if (!formValid) return;

        try {
            setAdminRemark(prev => ({ ...prev, loading: true }));

            const data = {
                projectId,
                notes,
                visible,
                observation,
                scopeOfImprovement,
                numOfTries,
                userId,
            };

            const res = await dispatch(addRemark(data));

            if (res?.payload?.code === 200) {
                toast.success("Remark added successfully!");
                setAdminRemark({
                    visible: false,
                    notes: "",
                    errors: {},
                    loading: false,
                });

                // Refresh project list
                dispatch(projectList({
                    userId: userId || "",
                    page: "",
                    startdate: "",
                    enddate: "",
                    search: "",
                    timeFrame: "",
                }));
                onClose();
            } else {
                toast.error("Something went wrong!");
                setAdminRemark(prev => ({ ...prev, loading: false }));
            }
        } catch (err) {
            console.error(err);
            setAdminRemark(prev => ({ ...prev, loading: false }));
        }
    };

    const handleClose = () => {
        setAdminRemark(initialState);

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="relative w-full max-w-6xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                    {/* Header */}
                    <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-600 p-2">
                                    <FiMessageSquare className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Project Remarks & Notes
                                    </h2>
                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                        <span className="font-medium">{projectName}</span>
                                        <span className="text-gray-400">•</span>
                                        <span>Model: {model}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Body - Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-gray-200">
                        {/* Left Column - Existing Remarks */}
                        <div className="max-h-[70vh] overflow-y-auto p-6">
                            <div className="mb-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FiMessageSquare className="h-5 w-5 text-gray-700" />
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Previous Remarks ({remarkData?.remarks?.length || 0})
                                        </h3>
                                    </div>
                                    {remarkData?.remarks?.length > 0 && (
                                        <span className="text-xs font-medium text-gray-500">
                                            Most recent first
                                        </span>
                                    )}
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <FiLoader className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                                        <p className="text-gray-600">Loading remarks...</p>
                                    </div>
                                ) : remarkData?.remarks?.length > 0 ? (
                                    <div className="space-y-4">
                                        {remarkData.remarks.slice(0, 5).map((remark, idx) => (
                                            <div
                                                key={idx}
                                                className="rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-200 transition-colors"
                                            >
                                                <div className="mb-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                                        <span className="text-sm font-medium text-gray-900">
                                                            Remark #{remarkData.remarks.length - idx}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <FiClock className="h-3 w-3" />
                                                        <span>Recent</span>
                                                    </div>
                                                </div>
                                                <div className="prose prose-sm max-w-none">
                                                    <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm">
                                                        {remark.length > 200 ? `${remark.substring(0, 200)}...` : remark}
                                                    </p>
                                                </div>
                                                {remarkData?.userName && (
                                                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                                        <FiUser className="h-3 w-3" />
                                                        <span>By: {remarkData.userName}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {remarkData.remarks.length > 5 && (
                                            <div className="pt-2 text-center">
                                                <p className="text-sm text-gray-500">
                                                    ... and {remarkData.remarks.length - 5} more remarks
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                                        <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-3 text-gray-600">No previous remarks</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Start the conversation by adding a new remark
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Files Section */}
                            {remarkData?.uploaded_files?.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="mb-3 flex items-center gap-2">
                                        <FiPaperclip className="h-5 w-5 text-gray-700" />
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Attached Files
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        {remarkData.uploaded_files.slice(0, 3).map((file, idx) => (
                                            <a
                                                key={idx}
                                                href={file.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 hover:border-blue-300 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <FiFileText className="h-4 w-4 text-blue-600" />
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-gray-900">
                                                            {file.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <FiDownload className="h-4 w-4 text-gray-400" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Add New Remark */}
                        <div className="max-h-[70vh] overflow-y-auto p-6">
                            <div className="mb-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <FiPlus className="h-5 w-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Add New Remark
                                    </h3>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Notes <span className="text-red-500">*</span>
                                    </label>
                                    <div className="rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                                        <ReactQuill
                                            theme="snow"
                                            value={notes}
                                            onChange={ckeditorhandler}
                                            className="p-2"
                                            modules={{
                                                toolbar: [
                                                    ['bold', 'italic', 'underline'],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                    ['link'],
                                                    ['clean']
                                                ]
                                            }}
                                        />
                                    </div>
                                    {errors?.nameError && (
                                        <p className="mt-2 text-sm text-red-600">{errors.nameError}</p>
                                    )}
                                    <p className="mt-2 text-xs text-gray-500">
                                        Provide clear and detailed feedback about the project.
                                    </p>
                                </div>

                                {/* Additional Info (if available) */}
                                {/* {(observation || scopeOfImprovement || numOfTries) && (
                  <div className="mb-6 rounded-lg bg-blue-50 p-4">
                    <h4 className="mb-3 text-sm font-semibold text-gray-900">
                      Additional Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      {observation && (
                        <div>
                          <p className="font-medium text-gray-700">Observation:</p>
                          <p className="text-gray-600">{observation}</p>
                        </div>
                      )}
                      {scopeOfImprovement && (
                        <div>
                          <p className="font-medium text-gray-700">Scope of Improvement:</p>
                          <p className="text-gray-600">{scopeOfImprovement}</p>
                        </div>
                      )}
                      {numOfTries && (
                        <div>
                          <p className="font-medium text-gray-700">Number of Tries:</p>
                          <p className="text-gray-600">{numOfTries}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )} */}

                                {/* Visibility Toggle */}
                                <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {visible ? (
                                                <FiEye className="h-5 w-5 text-emerald-600" />
                                            ) : (
                                                <FiEyeOff className="h-5 w-5 text-gray-400" />
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    Visibility Settings
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {visible
                                                        ? "This remark will be visible to users"
                                                        : "Only admins can see this remark"}
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={visible}
                                                onChange={(e) => setAdminRemark({ ...adminRemark, visible: e.target.checked })}
                                            />
                                            <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleClose}
                                        disabled={saving}
                                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveHandler}
                                        disabled={saving}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <>
                                                <FiLoader className="h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FiSave className="h-4 w-4" />
                                                Save Remark
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Quick Summary */}
                    <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <FiMessageSquare className="h-4 w-4" />
                                    <span>{remarkData?.remarks?.length || 0} remarks</span>
                                </div>
                                {remarkData?.uploaded_files?.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <FiPaperclip className="h-4 w-4" />
                                        <span>{remarkData.uploaded_files.length} files</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-gray-500">
                                All remarks are saved to the project history
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CombinedRemarkModal;