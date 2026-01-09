import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ReturnDataSplit } from "../../../reduxToolkit/Slices/projectSlices";

function DataSplitStepDetails({
  flaskUrl,
  username,
  projectName,
  version,
  task,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [split, setSplit] = useState({
    train: 80,
    val: 20,
  });

  useEffect(() => {
    if (!username || !projectName || !version) return;

    const fetchSplit = async () => {
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
          ReturnDataSplit({ payload, url: flaskUrl })
        );

        if (res?.payload?.status !== 200) {
          throw new Error("Failed to fetch data split");
        }

        const ratio = res?.payload?.data?.split_ratio;

        if (typeof ratio === "number") {
          const train = (ratio * 100).toFixed(2);
          const val = (100 - train).toFixed(2);

          setSplit({
            train,
            val,
          });
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load data split");
      } finally {
        setLoading(false);
      }
    };

    fetchSplit();
  }, [dispatch, flaskUrl, username, projectName, version, task]);

  if (loading) {
    return (
      <div className="mt-3 text-sm text-gray-500">
        Loading data split…
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

  return (
    <div className="mt-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
      <h4 className="mb-3 text-sm font-semibold text-gray-900">
        Dataset Split
      </h4>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Training</span>
          <span className="font-semibold text-gray-900">
            {split.train}%
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Validation</span>
          <span className="font-semibold text-gray-900">
            {split.val}%
          </span>
        </div>
      </div>

      {/* simple visual bar */}
      <div className="flex h-2 mt-3 overflow-hidden rounded bg-gray-200">
        <div
          className="bg-blue-600"
          style={{ width: `${split.train}%` }}
        />
        <div
          className="bg-emerald-500"
          style={{ width: `${split.val}%` }}
        />
      </div>
    </div>
  );
}

export default DataSplitStepDetails;
