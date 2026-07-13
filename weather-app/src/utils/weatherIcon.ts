import {
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudRain,
  CloudLightning, CloudSnow, type LucideIcon,
} from 'lucide-react';
import type { WeatherCategory } from '../types/weather';

export function weatherIcon(category: WeatherCategory, isDay: boolean): LucideIcon {
  switch (category) {
    case 'clear': return isDay ? Sun : Moon;
    case 'partly-cloudy': return isDay ? CloudSun : CloudMoon;
    case 'cloudy': return Cloud;
    case 'fog': return CloudFog;
    case 'rain': return CloudRain;
    case 'thunderstorm': return CloudLightning;
    case 'snow': return CloudSnow;
  }
}
