import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";

interface InputPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function InputPanel({ prompt, onPromptChange, onSubmit, isLoading }: InputPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium">Prompt</label>
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Enter your prompt here..."
          className="min-h-24 mt-2"
          disabled={isLoading}
        />
      </div>
      <Button onClick={onSubmit} disabled={isLoading || !prompt.trim()}>
        {isLoading ? "Processing..." : "Send"}
      </Button>
    </div>
  );
}
