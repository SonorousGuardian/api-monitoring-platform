"use client";

// Types
export interface ApiLog {
    id: string;
    serviceName: string;
    method: string;
    endpoint: string;
    statusCode: number;
    latencyMs: number;
    timestamp: string;
}

export interface Issue {
    id: string;
    serviceName: string;
    endpoint: string;
    errorType: string;
    status: "OPEN" | "RESOLVED";
    createdAt: string;
}

const STORAGE_KEY_LOGS = "api-monitor-logs";
const STORAGE_KEY_ISSUES = "api-monitor-issues";

const INITIAL_LOGS: ApiLog[] = [
    { id: "1", serviceName: "orders", method: "POST", endpoint: "/api/create", statusCode: 201, latencyMs: 45, timestamp: new Date(Date.now() - 10000).toISOString() },
    { id: "2", serviceName: "payments", method: "POST", endpoint: "/api/process", statusCode: 500, latencyMs: 1200, timestamp: new Date(Date.now() - 5000).toISOString() },
];

const INITIAL_ISSUES: Issue[] = [
    { id: "1", serviceName: "payments", endpoint: "/api/process", errorType: "Broken API (5xx)", status: "OPEN", createdAt: new Date(Date.now() - 5000).toISOString() }
];

class Store {
    private listeners: Function[] = [];

    constructor() {
        if (typeof window !== "undefined") {
            // Initialize if empty
            if (!localStorage.getItem(STORAGE_KEY_LOGS)) {
                localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(INITIAL_LOGS));
            }
            if (!localStorage.getItem(STORAGE_KEY_ISSUES)) {
                localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(INITIAL_ISSUES));
            }
        }
    }

    getLogs(): ApiLog[] {
        if (typeof window === "undefined") return INITIAL_LOGS;
        return JSON.parse(localStorage.getItem(STORAGE_KEY_LOGS) || "[]");
    }

    getIssues(): Issue[] {
        if (typeof window === "undefined") return INITIAL_ISSUES;
        return JSON.parse(localStorage.getItem(STORAGE_KEY_ISSUES) || "[]");
    }

    addLog(log: ApiLog) {
        const logs = this.getLogs();
        const newLogs = [log, ...logs].slice(0, 100); // Keep last 100
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(newLogs));

        // Auto-generate Issue if bad
        if (log.statusCode >= 500 || log.latencyMs > 500) {
            this.addIssue({
                id: Date.now().toString() + "_issue",
                serviceName: log.serviceName,
                endpoint: log.endpoint,
                errorType: log.statusCode >= 500 ? "Broken API (5xx)" : "Slow API (>500ms)",
                status: "OPEN",
                createdAt: new Date().toISOString()
            });
        } else {
            this.notify();
        }
    }

    addIssue(issue: Issue) {
        const issues = this.getIssues();
        const exists = issues.find(i => i.serviceName === issue.serviceName && i.endpoint === issue.endpoint && i.status === "OPEN");

        // Only add if not already an open issue for this service/endpoint
        if (!exists) {
            const newIssues = [issue, ...issues];
            localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(newIssues));
            this.notify();
        } else {
            this.notify(); // Notify anyway to update logs view
        }
    }

    resolveIssue(id: string) {
        const issues = this.getIssues();
        const newIssues = issues.map(i => i.id === id ? { ...i, status: "RESOLVED" as const } : i);
        localStorage.setItem(STORAGE_KEY_ISSUES, JSON.stringify(newIssues));
        this.notify();
    }

    subscribe(listener: Function) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        this.listeners.forEach(l => l());
    }
}

export const store = new Store();
