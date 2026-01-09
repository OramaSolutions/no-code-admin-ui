import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ReturnHypertune } from "../../../reduxToolkit/Slices/projectSlices";

function HypertuneStepDetails({
  flaskUrl,
  username,
  projectName,
  version,
  task,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(null);

  useEffect(() => {
    if (!username || !projectName || !version) return;

    const fetchHypertune = async () => {
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
          ReturnHypertune({ payload, url: flaskUrl })
        );

        if (res?.payload?.status !== 200) {
          throw new Error("Failed to fetch hypertune config");
        }

        const d = res?.payload?.data || {};

        setParams({
          pre_trained_model: d?.model?.split("/")?.at(-1) || "default",
          imgsz: d?.imgsz ?? 640,
          batch: d?.batch ?? 32,
          epochs: d?.epochs ?? 60,
          device: d?.device ?? "0",
          patience: d?.patience ?? 20,
          single_cls: d?.single_cls === "true",

          // augmentation-like
          mosaic: d?.mosaic ?? 0,
          close_mosaic: d?.close_mosaic ?? 0,
          fliplr: d?.fliplr ?? 0,
          flipud: d?.flipud ?? 0,
          dropout: d?.dropout ?? 0,

          // geometric
          scale: d?.scale ?? 0,
          translate: d?.translate ?? 0,
          shear: d?.shear ?? 0,

          // hsv
          hsv_h: d?.hsv_h ?? 0,
          hsv_s: d?.hsv_s ?? 0,
          hsv_v: d?.hsv_v ?? 0,

          validation_conf: d?.validation_conf ?? 0.25,
          erasing: d?.erasing ?? 0,
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load hypertune details");
      } finally {
        setLoading(false);
      }
    };

    fetchHypertune();
  }, [dispatch, flaskUrl, username, projectName, version, task]);

  if (loading) {
    return (
      <div className="mt-3 text-sm text-gray-500">
        Loading hypertune configuration…
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

  if (!params) return null;

  return (
    <div className="mt-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">
        Hypertune Configuration
      </h4>

      {/* CORE */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <Item label="Model" value={params.pre_trained_model} />
        <Item label="Image Size" value={params.imgsz} />
        <Item label="Batch" value={params.batch} />
        <Item label="Epochs" value={params.epochs} />
        <Item label="Device" value={params.device} />
        <Item label="Patience" value={params.patience} />
        <Item
          label="Single Class"
          value={params.single_cls ? "Yes" : "No"}
        />
      </div>

      {/* AUG / GEOMETRIC */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <Item label="Mosaic" value={params.mosaic} />
        <Item label="Close Mosaic" value={params.close_mosaic} />
        <Item label="Flip LR" value={params.fliplr} />
        <Item label="Flip UD" value={params.flipud} />
        <Item label="Dropout" value={params.dropout} />
      </div>

      {/* TRANSFORMS */}
      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
        <Item label="Scale" value={params.scale} />
        <Item label="Translate" value={params.translate} />
        <Item label="Shear" value={params.shear} />
        <Item label="HSV-H" value={params.hsv_h} />
        <Item label="HSV-S" value={params.hsv_s} />
        <Item label="HSV-V" value={params.hsv_v} />
      </div>

      <div className="text-sm">
        <Item
          label="Validation Confidence"
          value={params.validation_conf}
        />
      </div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div className="flex items-center justify-between px-2 py-1 bg-white border rounded">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{String(value)}</span>
    </div>
  );
}

export default HypertuneStepDetails;
