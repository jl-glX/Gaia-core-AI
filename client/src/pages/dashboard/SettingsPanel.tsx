import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Slider } from "../../components/ui/slider";
import { Input } from "../../components/ui/input";

interface Settings {
  temperature: number;
  maxTokens: number;
}

interface SettingsPanelProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const handleTemperatureChange = (value: number[]) => {
    onSettingsChange({
      ...settings,
      temperature: value[0],
    });
  };

  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      maxTokens: parseInt(e.target.value) || 2000,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Temperature: {settings.temperature.toFixed(2)}</Label>
          <Slider
            value={[settings.temperature]}
            onValueChange={handleTemperatureChange}
            min={0}
            max={2}
            step={0.1}
          />
          <p className="text-xs text-gray-600">Controls randomness. Higher = more creative.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxTokens">Max Tokens</Label>
          <Input
            id="maxTokens"
            type="number"
            value={settings.maxTokens}
            onChange={handleMaxTokensChange}
            min={1}
            max={32000}
          />
        </div>
      </CardContent>
    </Card>
  );
}
