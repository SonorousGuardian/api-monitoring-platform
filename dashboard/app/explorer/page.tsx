"use client";

import { useState, useEffect } from "react";
import { store, ApiLog } from "../../lib/store";

export default function ExplorerPage() {
    const [logs, setLogs] = useState<ApiLog[]>([]);
    const [filter, setFilter] = useState("");

    // Subscribe to store
    useEffect(() => {
        setLogs(store.getLogs()); // Initial load
        const unsubscribe = store.subscribe(() => {
            setLogs(store.getLogs());
        });
        return unsubscribe;
    }, []);

    const simulateLog = () => {
        const methods = ["GET", "POST", "PUT", "DELETE"];
        const services = ["orders", "payments", "users", "inventory"];
        const endpoints = ["/api/create", "/api/get", "/api/notify", "/api/list"];
        const statuses = [200, 201, 200, 201, 400, 500, 429]; // Weighted towards success

        // Randomly generate latency (occasionally slow)
        const isSlow = Math.random() > 0.8;
        const latency = isSlow ? Math.floor(Math.random() * 1000) + 500 : Math.floor(Math.random() * 200);

        const newLog: ApiLog = {
            id: Date.now().toString(),
            serviceName: services[Math.floor(Math.random() * services.length)],
            method: methods[Math.floor(Math.random() * methods.length)],
            endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
            statusCode: statuses[Math.floor(Math.random() * statuses.length)],
            latencyMs: latency,
            timestamp: new Date().toISOString()
        };

        store.addLog(newLog);
    };

    const filteredLogs = logs.filter(log =>
        log.serviceName.toLowerCase().includes(filter.toLowerCase()) ||
        log.endpoint.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">API Log Explorer</h2>
                <div className="flex gap-2">
                    <button
                        onClick={simulateLog}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium transition"
                    >
                        Simulate Traffic
                    </button>
                    <input
                        type="text"
                        placeholder="Filter by service or endpoint..."
                        className="bg-gray-800 border-gray-700 rounded px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border border-gray-800 bg-gray-900/50 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-800 bg-gray-800/50 text-gray-400">
                        <tr>
                            <th className="p-4">Time</th>
                            <th className="p-4">Service</th>
                            <th className="p-4">Method</th>
                            <th className="p-4">Endpoint</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Latency</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length === 0 ? (
                            <tr><td colSpan={6} className="p-4 text-center text-gray-500">No logs found</td></tr>
                        ) : (
                            filteredLogs.map((log) => (
                                <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                                    <td className="p-4 text-gray-500">{new Date(log.timestamp).toLocaleTimeString('en-US', { hour12: false })}</td>
                                    <td className="p-4 font-medium">{log.serviceName}</td>
                                    <td className="p-4">
                                        <span className={`font-mono text-xs font-bold px-2 py-1 rounded bg-gray-800 ${log.method === 'POST' ? 'text-blue-400' : 'text-green-400'}`}>
                                            {log.method}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-300">{log.endpoint}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${log.statusCode >= 500 ? 'bg-red-500/10 text-red-500' :
                                            log.statusCode === 429 ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-green-500/10 text-green-500'
                                            }`}>
                                            {log.statusCode}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono">
                                        <span className={log.latencyMs > 500 ? "text-red-400" : "text-gray-400"}>
                                            {log.latencyMs}ms
                                        </span>
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

