"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { store, ApiLog, Issue } from "../lib/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function Home() {
    const [stats, setStats] = useState([
        { title: "Total Logs", value: "0", color: "text-blue-500" },
        { title: "Broken APIs (5xx)", value: "0", color: "text-red-500" },
        { title: "Slow APIs (>500ms)", value: "0", color: "text-yellow-500" },
        { title: "Active Issues", value: "0", color: "text-orange-500" },
    ]);
    const [recentAlerts, setRecentAlerts] = useState<Issue[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const updateStats = () => {
            const logs = store.getLogs();
            const issues = store.getIssues();

            const totalLogs = logs.length;
            const broken = logs.filter((l: ApiLog) => l.statusCode >= 500).length;
            const slow = logs.filter((l: ApiLog) => l.latencyMs > 500).length;
            const activeIssues = issues.filter((i: Issue) => i.status === "OPEN").length;

            setStats([
                { title: "Total Logs", value: totalLogs.toString(), color: "text-blue-500" },
                { title: "Broken APIs (5xx)", value: broken.toString(), color: "text-red-500" },
                { title: "Slow APIs (>500ms)", value: slow.toString(), color: "text-yellow-500" },
                { title: "Active Issues", value: activeIssues.toString(), color: "text-orange-500" },
            ]);

            setRecentAlerts(issues.filter((i: Issue) => i.status === "OPEN").slice(0, 5));

            // Chart Data: Status Code Distribution
            const statusCodes = logs.reduce((acc: any, log: ApiLog) => {
                const range = log.statusCode >= 500 ? "5xx" : log.statusCode >= 400 ? "4xx" : log.statusCode >= 300 ? "3xx" : "2xx";
                acc[range] = (acc[range] || 0) + 1;
                return acc;
            }, {});

            setChartData([
                { name: "2xx Success", value: statusCodes["2xx"] || 0, fill: "#10b981" },
                { name: "3xx Redirect", value: statusCodes["3xx"] || 0, fill: "#3b82f6" },
                { name: "4xx Client Error", value: statusCodes["4xx"] || 0, fill: "#f59e0b" },
                { name: "5xx Server Error", value: statusCodes["5xx"] || 0, fill: "#ef4444" },
            ]);
        };

        updateStats();
        const unsubscribe = store.subscribe(updateStats);
        return unsubscribe;
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
                <p className="text-gray-400">Real-time metrics from your microservices.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.title} className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-400">{stat.title}</h3>
                        <div className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                    <h3 className="mb-4 text-lg font-semibold">Status Code Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(entry) => `${entry.name}: ${entry.value}`}
                                outerRadius={80}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                    <h3 className="mb-4 text-lg font-semibold">Recent Active Issues</h3>
                    <div className="space-y-4">
                        {recentAlerts.length === 0 ? (
                            <p className="text-gray-500 text-sm">No active issues.</p>
                        ) : (
                            recentAlerts.map((issue: Issue) => (
                                <div key={issue.id} className="flex items-center justify-between border-b border-gray-800 pb-2">
                                    <span className="text-red-400">{issue.errorType}</span>
                                    <span className="text-sm text-gray-500">
                                        {issue.serviceName} | {issue.endpoint}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
                <div className="flex gap-2">
                    <Link href="/explorer" className="rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700">
                        View All Logs
                    </Link>
                    <Link href="/issues" className="rounded bg-gray-800 px-4 py-2 text-sm font-medium hover:bg-gray-700">
                        Manage Issues
                    </Link>
                </div>
            </div>
        </div>
    );
}
