import React from "react";
import Modal from "react-bootstrap/Modal";

export const Deletemodal = ({
  onOpen,
  onClose,
  loading,
  message,
  onDelete,
  onDeletePermanent,
  type = "soft", // 'soft' or 'permanent'
}) => {
  const isPermanent = type === "permanent";

  return (
    <Modal
      show={onOpen}
      onHide={onClose}
      centered
      className="!bg-transparent"
      backdrop="static"
    >
      <Modal.Body className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center border border-gray-200">
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
          onClick={onClose}
        >
          ×
        </button>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          {isPermanent ? "Delete Permanently" : "Delete"}
        </h3>

        <p className="text-gray-600 mb-6">
          {isPermanent
            ? `Are you sure you want to permanently delete this ${message}? This action cannot be undone.`
            : `Are you sure you want to delete or deactivate this ${message}?`}
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition"
            disabled={loading}
          >
            No
          </button>

          {!isPermanent && (
            <button
              onClick={() => {
                if (!loading) onDelete();
              }}
              disabled={loading}
              className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition disabled:opacity-70"
            >
              {loading ? "Processing..." : "Deactivate"}
            </button>
          )}

          {isPermanent && (
            <button
              onClick={() => {
                if (!loading) onDeletePermanent();
              }}
              disabled={loading}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-70"
            >
              {loading ? "Deleting..." : "Delete Permanently"}
            </button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
