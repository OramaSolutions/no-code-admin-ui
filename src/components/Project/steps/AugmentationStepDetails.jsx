import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ReturnAgumentation } from "../../../reduxToolkit/Slices/projectSlices";

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// helpers (same logic you already use)
const asUpper = (v, fallback) =>
    Array.isArray(v) ? (v[1] ?? fallback) : (v ?? fallback);

const asSigned = (v, fallback = 0) => {
    if (!Array.isArray(v)) return v ?? fallback;

    const lo = v[0] ?? 0;
    const hi = v[1] ?? 0;

    if (hi !== 0 && lo === 0) return hi;
    if (lo !== 0 && hi === 0) return lo;

    return Math.abs(hi) >= Math.abs(lo) ? hi : lo;
};

function AugmentationStepDetails({
    flaskUrl,
    username,
    projectName,
    version,
    task,
    datasetCount
}) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!username || !projectName || !version) return;

        const fetchAugmentations = async () => {
            try {
                setLoading(true);
                setError(null);

                const payload = {
                    username,
                    version,
                    project: projectName,
                    task,
                };

                const res = await dispatch(
                    ReturnAgumentation({ payload, url: flaskUrl })
                );

                if (res?.payload?.status !== 200) {
                    throw new Error("Augmentation fetch failed");
                }

                const aug = res?.payload?.data?.augmentations ?? {};

                const brightness = asSigned(aug?.brightness_limit, 0);
                const contrast = asSigned(aug?.contrast_limit, 0);
                const noiseUpper = asUpper(aug?.gauss_noise_var_limit, undefined);

                setSummary({
                    rotation: !!aug?.rotate_limit,
                    crop: !!aug?.crop?.p,
                    verticalFlip: !!aug?.vertical_flip_prob,
                    horizontalFlip: !!aug?.horizontal_flip_prob,
                    brightness: brightness !== 0,
                    contrast: contrast !== 0,
                    saturation: asUpper(aug?.hue_saturation_limit, 0) > 0,
                    noise: typeof noiseUpper === "number" && noiseUpper >= 10,
                    blur: !!aug?.blur_prob,
                    multiplier: res?.payload?.data?.multiplier || "1",

                    // numeric values (admin often needs this)
                    rotate_limit: aug?.rotate_limit ?? 0,
                    brightness_limit: clamp(brightness, -0.5, 0.5),
                    contrast_limit: clamp(contrast, -0.5, 0.5),
                    hue_saturation_limit: clamp(
                        asUpper(aug?.hue_saturation_limit, 20),
                        0,
                        80
                    ),
                    gauss_noise_var_limit: clamp(
                        asUpper(aug?.gauss_noise_var_limit, 10),
                        10,
                        50
                    ),
                });
            } catch (err) {
                console.error(err);
                setError("Failed to load augmentation details");
            } finally {
                setLoading(false);
            }
        };

        fetchAugmentations();
    }, [dispatch, flaskUrl, username, projectName, version, task]);

    if (loading) {
        return (
            <div className="mt-3 text-sm text-gray-500">
                Loading augmentation details…
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-3 text-sm text-red-600">
                {error}
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div className="mt-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">
                Applied Augmentations
            </h4>

            <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries({
                    Rotation: summary.rotation,
                    Crop: summary.crop,
                    "Vertical Flip": summary.verticalFlip,
                    "Horizontal Flip": summary.horizontalFlip,
                    Brightness: summary.brightness,
                    Contrast: summary.contrast,
                    Saturation: summary.saturation,
                    Noise: summary.noise,
                    Blur: summary.blur,
                }).map(([label, enabled]) => (
                    <div
                        key={label}
                        className="flex items-center justify-between px-2 py-1 rounded bg-white border"
                    >
                        <span className="text-gray-700">{label}</span>
                        <span
                            className={`text-xs font-medium ${enabled ? "text-emerald-600" : "text-gray-400"
                                }`}
                        >
                            {enabled ? "ON" : "OFF"}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-3 text-sm text-gray-700">
                Total Augmented Dataset Size:{" "}
                <span className="font-semibold">{summary.multiplier}×</span>
                <span className="font-semibold">{datasetCount}</span>
            </div>
        </div>
    );
}

export default AugmentationStepDetails;
