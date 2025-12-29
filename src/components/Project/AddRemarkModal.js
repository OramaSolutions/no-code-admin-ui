import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify'
import { addRemark, projectList } from '../../reduxToolkit/Slices/projectSlices';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
    FiX,
    FiSave,
    FiEye,
    FiEyeOff,
    FiLoader
} from 'react-icons/fi';

const initialState = {
    visible: false,
    notes: "",
    errors: {},
    loading: false,
}

function RemarkModal({ istate, setIstate, userId, remarkData }) {
    // console.log('remark data in remark mdoal ', remarkData)
    const { id, projectName, model, showRemark } = istate;
    const dispatch = useDispatch();
    const [adminRemark, setadminRemark] = useState(initialState)
    const { visible, notes, errors, loading } = adminRemark

    const ckeditorhandler = (content, editor) => {
        setadminRemark({ ...adminRemark, notes: content })
    }
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

    const { observation, scopeOfImprovement, numOfTries } =
        parseRemarkStrings(remarkData?.remarks || []);

    const handleValidation = () => {
        let formIsValid = true;
        let error = {}
        if (!notes?.trim()) {
            formIsValid = false
            error.nameError = "Notes are required"
        }
        setadminRemark({ ...adminRemark, errors: error })
        return formIsValid
    }

    // const saveHandler = async () => {
    //     let formValid = handleValidation()
    //     if (formValid) {
    //         try {
    //             setadminRemark({ ...adminRemark, loading: true })
    //             const data = { projectId: id, notes, visible }
    //             const res = await dispatch(addRemark(data))
    //             if (res?.payload?.code === 200) {
    //                 setadminRemark({ ...adminRemark, loading: false, notes: "", errors: {}, visible: false })
    //                 toast.success("Remark added successfully!");
    //                 handleClose()
    //                 dispatch(projectList({
    //                     userId: userId ? userId : "",
    //                     page: "",
    //                     startdate: "",
    //                     enddate: "",
    //                     search: "",
    //                     timeFrame: "",
    //                 }))
    //             } else {
    //                 toast.error("Something went wrong!");
    //                 setadminRemark({ ...adminRemark, loading: false, notes: "", errors: {}, visible: true })
    //             }
    //         } catch (err) {
    //             console.log(err, "Error adding remark")
    //             setadminRemark({ ...adminRemark, loading: false, notes: "", errors: {}, visible: true })
    //         }
    //     }
    // }

    const saveHandler = async () => {
    let formValid = handleValidation();
    if (!formValid) return;

    try {
        setadminRemark(prev => ({ ...prev, loading: true }));

        const data = {
            projectId: id,
            notes,
            visible,
            observation,
            scopeOfImprovement,
            numOfTries,
            userId, // already passed as prop
        };

        const res = await dispatch(addRemark(data));

        if (res?.payload?.code === 200) {
            toast.success("Remark added successfully!");

            setadminRemark({
                visible: false,
                notes: "",
                errors: {},
                loading: false,
            });

            handleClose();
        } else {
            toast.error("Something went wrong");
            setadminRemark(prev => ({ ...prev, loading: false }));
        }
    } catch (err) {
        console.error(err);
        setadminRemark(prev => ({ ...prev, loading: false }));
    }
};


    const handleClose = () => {
        setIstate({ ...istate, id: "", projectName: "", model: "", showRemark: "" })
    }

    return (
        <>
            {showRemark && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
                        onClick={handleClose}
                    ></div>

                    {/* Modal */}
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                            {/* Header */}
                            <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            Add Admin Remark
                                        </h3>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                            <span className="font-medium">{projectName}</span>
                                            <span className="text-gray-400">•</span>
                                            <span>Model: {model}</span>
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

                            {/* Body */}
                            <div className="p-6">
                                {/* Notes Editor */}
                                <div className="mb-6">
                                    <label className="mb-2 block text-sm font-medium text-gray-900">
                                        Notes
                                        <span className="ml-1 text-red-500">*</span>
                                    </label>
                                    <div className="rounded-lg border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
                                        <ReactQuill
                                            theme="snow"
                                            value={notes}
                                            onChange={ckeditorhandler}
                                            className=""
                                            modules={{
                                                toolbar: [
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                                                    [{ 'color': [] }, { 'background': [] }],
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
                                        Add detailed notes about this project. Rich text formatting is supported.
                                    </p>
                                </div>

                                {/* Visibility Toggle */}
                                <div className="mb-2 rounded-lg bg-gray-50 px-2 py-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items- gap-3">
                                            {visible ? (
                                                <FiEye className="h-5 w-5 text-emerald-600" />
                                            ) : (
                                                <FiEyeOff className="h-5 w-5 text-gray-400" />
                                            )}
                                            <div className=' flex flex-col justify-center '>
                                                <p className="font-medium text-gray-900">
                                                    Visibility to Users
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {visible
                                                        ? "Users will be able to see this remark"
                                                        : "Only admins will see this remark"}
                                                </p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex cursor-pointer items-center">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={visible}
                                                onChange={(e) => setadminRemark({ ...adminRemark, visible: e.target.checked })}
                                            />
                                            <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                        </label>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
                                    <button
                                        onClick={handleClose}
                                        disabled={loading}
                                        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveHandler}
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
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
                </div>
            )}
        </>
    )
}

export default RemarkModal