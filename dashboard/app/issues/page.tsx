"use client";

import { useState, useEffect } from "react";
import { store, Issue } from "../../lib/store";

export default function IssuesPage() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [filter, setFilter] = useState("");
    const [loading, setLoading] = useState(true);

    // Subscribe to store
    useEffect(() => {
        setIssues(store.getIssues());
        setLoading(false);

        const unsubscribe = store.subscribe(() => {
            setIssues(store.getIssues());
        });

        return unsubscribe;
    }, []);

    const resolveIssue = async (id: string) => {
        store.resolveIssue(id);
    };

    const filteredIssues = issues.filter(issue =>
        issue.serviceName.toLowerCase().includes(filter.toLowerCase()) ||
        issue.errorType.toLowerCase().includes(filter.toLowerCase()) ||
        issue.endpoint.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Issue Management</h2>
                <div className="w-64">
                    <input
                        type="text"
                        placeholder="Search issues..."
                        className="w-full bg-gray-800 border-gray-700 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-gray-800 bg-gray-900/50">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-800 bg-gray-800/50 text-gray-400">
                        <tr>
                            <th className="p-4">Service</th>
                            <th className="p-4">Endpoint</th>
                            <th className="p-4">Issue</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredIssues.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center text-gray-500">No issues found</td></tr>
                        ) : (
                            filteredIssues.map((issue) => (
                                <tr key={issue.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                                    <td className="p-4 font-medium">{issue.serviceName}</td>
                                    <td className="p-4 text-gray-400">{issue.endpoint}</td>
                                    <td className="p-4 text-red-400">{issue.errorType}</td>
                                    <td className="p-4">
                                        <span className={`rounded-full px-2 py-1 text-xs ${issue.status === 'OPEN' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {issue.status === "OPEN" && (
                                            <button
                                                onClick={() => resolveIssue(issue.id)}
                                                className="rounded bg-green-600 px-3 py-1 text-xs hover:bg-green-700"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
