import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

interface ResponseViewerProps {
  response: string;
  tokensUsed?: number;
  model?: string;
  isLoading: boolean;
}

export function ResponseViewer({ response, tokensUsed, model, isLoading }: ResponseViewerProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">Processing...</div>
        </CardContent>
      </Card>
    );
  }

  if (!response) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400">No response yet. Send a prompt to get started.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Response</span>
          {tokensUsed && (
            <span className="text-sm font-normal text-gray-600">{tokensUsed} tokens</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="whitespace-pre-wrap text-sm">{response}</div>
          {model && <div className="text-xs text-gray-500">Model: {model}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
