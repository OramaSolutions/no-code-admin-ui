import React, { useEffect, useState } from "react";

function LabelledStepDetails({
    flaskUrl,
    username,
    projectName,
    version,
    task,
    setDatasetCount
}) {
    const [data, setData] = useState({
        count: 0,
        thumbnails: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!username || !projectName || !version) return;

        const fetchLabelledData = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `${flaskUrl}get_thumbnails?username=${username}&task=${task}&project=${projectName}&version=${version}&thumbnail_name=dataset_thumbnails`
                );

                if (!res.ok) {
                    throw new Error(`Failed with status ${res.status}`);
                }

                const json = await res.json();
                setDatasetCount(json?.count || 0,)
                setData({
                    count: json?.count || 0,
                    thumbnails: json?.thumbnails || [],
                });
            } catch (err) {
                console.error("Labelled step fetch failed:", err);
                setError("Failed to load labelled dataset info");
            } finally {
                setLoading(false);
            }
        };

        fetchLabelledData();
    }, [flaskUrl, username, projectName, version, task]);

    return (
        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="mb-2 text-sm font-semibold text-gray-900">
                Labelled Dataset
            </h4>

            {loading && (
                <p className="text-sm text-gray-500">Loading dataset info...</p>
            )}

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}

            {!loading && !error && (
                <>
                    <p className="text-sm text-gray-700">
                        Total images:{" "}
                        <span className="font-semibold">{data.count}</span>
                    </p>

                    {data.thumbnails.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mt-3">
                            {data.thumbnails.slice(0, 8).map((thumb, idx) => (
                                <img
                                    key={idx}
                                    src={`${thumb}`}
                                    alt="dataset thumbnail"
                                    className="object-cover w-full h-16 rounded border"
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default LabelledStepDetails;
