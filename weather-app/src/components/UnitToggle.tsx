import type { TemperatureUnit, SpeedUnit } from '../types/weather';

interface Props {
  temperature: TemperatureUnit;
  speed: SpeedUnit;
  onChangeTemperature: (u: TemperatureUnit) => void;
  onChangeSpeed: (u: SpeedUnit) => void;
}

export default function UnitToggle({ temperature, speed, onChangeTemperature, onChangeSpeed }: Props) {
  return (
    <div className="flex items-center gap-2">
      <SegmentedToggle
        label="Temperature unit"
        value={temperature}
        options={[{ value: 'C', label: '°C' }, { value: 'F', label: '°F' }]}
        onChange={onChangeTemperature}
      />
      <SegmentedToggle
        label="Wind speed unit"
        value={speed}
        options={[{ value: 'kmh', label: 'km/h' }, { value: 'mph', label: 'mph' }]}
        onChange={onChangeSpeed}
      />
    </div>
  );
}

function SegmentedToggle<T extends string>({
  label, value, options, onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="glass-light rounded-full p-0.5 flex text-xs font-mono">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1.5 rounded-full transition-colors ${
            value === opt.value ? 'bg-brass-500 text-ink-950 font-semibold' : 'text-mist hover:text-parchment'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
