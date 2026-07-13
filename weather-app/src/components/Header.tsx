import { Compass } from 'lucide-react';
import type { GeoLocation, TemperatureUnit, SpeedUnit } from '../types/weather';
import LocationSearch from './LocationSearch';
import UnitToggle from './UnitToggle';

interface Props {
  onSelectLocation: (loc: GeoLocation) => void;
  recents: GeoLocation[];
  onUseCurrentLocation: () => void;
  locatingCurrent: boolean;
  temperature: TemperatureUnit;
  speed: SpeedUnit;
  onChangeTemperature: (u: TemperatureUnit) => void;
  onChangeSpeed: (u: SpeedUnit) => void;
}

export default function Header({
  onSelectLocation, recents, onUseCurrentLocation, locatingCurrent, temperature, speed, onChangeTemperature, onChangeSpeed,
}: Props) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-ink-950/30 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-parchment shrink-0">
          <Compass size={20} className="text-brass-400" aria-hidden="true" />
          <span className="font-display text-lg tracking-tight">Fieldglass</span>
        </div>
        <div className="flex-1 max-w-md">
          <LocationSearch
            onSelect={onSelectLocation}
            recents={recents}
            onUseCurrentLocation={onUseCurrentLocation}
            locatingCurrent={locatingCurrent}
          />
        </div>
        <div className="ml-auto hidden md:block">
          <UnitToggle
            temperature={temperature}
            speed={speed}
            onChangeTemperature={onChangeTemperature}
            onChangeSpeed={onChangeSpeed}
          />
        </div>
      </div>
      <div className="md:hidden px-4 sm:px-6 pb-3 flex justify-end">
        <UnitToggle
          temperature={temperature}
          speed={speed}
          onChangeTemperature={onChangeTemperature}
          onChangeSpeed={onChangeSpeed}
        />
      </div>
    </header>
  );
}
