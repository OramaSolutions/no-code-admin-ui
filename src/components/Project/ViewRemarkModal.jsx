import React from "react";
import {
  FiX,
  FiMessageSquare,
  FiPaperclip,
  FiDownload,
  FiPlus,
  FiLoader,
  FiClock,
  FiUser
} from "react-icons/fi";

function ViewRemarkModal({
  show,
  onClose,
  remarkData,
  onAddReply,
  loading,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-3xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-600 p-2">
                  <FiMessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Project Remarks & Files
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    View all remarks and uploaded documents
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[60vh] overflow-y-auto p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FiLoader className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                <p className="text-gray-600">Loading remarks...</p>
              </div>
            ) : (
              <>
                {/* Remarks Section */}
                <div className="mb-8">
                  <div className="mb-4 flex items-center gap-2">
                    <FiMessageSquare className="h-5 w-5 text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Remarks ({remarkData?.remarks?.length || 0})
                    </h3>
                  </div>

                  {remarkData?.remarks?.length > 0 ? (
                    <div className="space-y-4">
                      {remarkData.remarks.map((remark, idx) => (
                        <div 
                          key={idx} 
                          className="rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-200 transition-colors"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span className="text-sm font-medium text-gray-900">
                                Remark #{idx + 1}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <FiClock className="h-3 w-3" />
                                <span>Today</span>
                              </div>
                            </div>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                              {remark}
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
                    </div>
                  ) : (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                      <FiMessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-3 text-gray-600">No remarks available</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Be the first to add a remark
                      </p>
                    </div>
                  )}
                </div>

                {/* Files Section */}
                {remarkData?.uploaded_files?.length > 0 && (
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <FiPaperclip className="h-5 w-5 text-gray-700" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Attached Files ({remarkData.uploaded_files.length})
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {remarkData.uploaded_files.map((file, idx) => (
                        <a
                          key={idx}
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 p-2 group-hover:bg-blue-100 transition-colors">
                              <FiPaperclip className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {file.size ? `Size: ${file.size}` : 'Download file'}
                              </p>
                            </div>
                          </div>
                          <FiDownload className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onAddReply();
                  onClose();
                }}
                className="inline-flex items-center gap-2 w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="h-4 w-4" />
                Add Reply Remark
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewRemarkModal;