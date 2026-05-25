import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "error" | "success";
}

interface LogsPanelProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export function LogsPanel({ logs, onClearLogs }: LogsPanelProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between flex-row">
        <CardTitle>Activity Logs</CardTitle>
        <Button onClick={onClearLogs} variant="outline" size="sm">
          Clear
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-400 text-sm">No activity yet</div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className={`text-xs font-mono ${getLogColor(log.type)}`}>
                <span className="text-gray-500">{log.timestamp}</span> {log.message}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getLogColor(type: "info" | "error" | "success"): string {
  switch (type) {
    case "error":
      return "text-red-600";
    case "success":
      return "text-green-600";
    default:
      return "text-gray-700";
  }
}
