import { useState, useEffect } from "react";
import { InputPanel } from "./InputPanel";
import { ResponseViewer } from "./ResponseViewer";
import { SettingsPanel } from "./SettingsPanel";
import { LogsPanel } from "./LogsPanel";
import { checkHealth, processPrompt } from "../../lib/api";
import { formatLocalizedDateTime } from "../../lib/localization";

interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "error" | "success";
}

interface Settings {
  temperature: number;
  maxTokens: number;
}

export function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState(0);
  const [model, setModel] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<Settings>({
    temperature: 0.7,
    maxTokens: 2000,
  });
  const [isHealthy, setIsHealthy] = useState(false);

  useEffect(() => {
    const checkServerHealth = async () => {
      const healthy = await checkHealth();
      setIsHealthy(healthy);

      if (!healthy) {
        addLog("Server is not responding", "error");
      } else {
        addLog("Connected to server", "success");
      }
    };

    checkServerHealth();
  }, []);

  const addLog = (message: string, type: "info" | "error" | "success" = "info") => {
    const timestamp = formatLocalizedDateTime(new Date(), {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLogs((prev) => [{ timestamp, message, type }, ...prev].slice(0, 50));
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || !isHealthy) {
      addLog("Cannot send prompt - server not available", "error");
      return;
    }

    setIsLoading(true);
    addLog("Sending prompt...", "info");

    try {
      const result = await processPrompt({ prompt, settings });
      setResponse(result.content);
      setTokensUsed(result.tokensUsed);
      setModel(`${result.provider}/${result.model}`);
      result.warnings?.forEach((warning) => addLog(warning, "error"));
      addLog("Prompt processed successfully", "success");
    } catch (error) {
      addLog(`Error: ${error instanceof Error ? error.message : "Unknown error"}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Infrastructure Dashboard</h1>
          <p className="text-gray-600">
            Server Status:{" "}
            <span className={isHealthy ? "text-green-600" : "text-red-600"}>
              {isHealthy ? "Connected" : "Disconnected"}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <InputPanel
              prompt={prompt}
              onPromptChange={setPrompt}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />

            <ResponseViewer
              response={response}
              tokensUsed={tokensUsed}
              model={model}
              isLoading={isLoading}
            />
          </div>

          <div className="space-y-6">
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />

            <LogsPanel
              logs={logs}
              onClearLogs={() => {
                setLogs([]);
                addLog("Logs cleared", "info");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
