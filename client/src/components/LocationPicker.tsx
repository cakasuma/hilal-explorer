import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2, Search } from "lucide-react";
import type { Location } from "@/lib/astronomy";
import { PRESET_LOCATIONS } from "@/lib/astronomy";
import { useLanguage } from "@/lib/i18n";

interface LocationPickerProps {
  location: Location | null;
  onLocationChange: (loc: Location) => void;
}

export function LocationPicker({ location, onLocationChange }: LocationPickerProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [manualName, setManualName] = useState("");
  const [showManual, setShowManual] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError(t("geoNotSupported"));
      setShowManual(true);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        onLocationChange({
          name: "Current Location",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timezone: tz,
        });
        setLoading(false);
      },
      () => {
        setError(t("locationDenied"));
        setShowManual(true);
        setLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setError(t("invalidCoords"));
      return;
    }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    onLocationChange({
      name: manualName || `${lat.toFixed(2)}, ${lng.toFixed(2)}`,
      lat,
      lng,
      timezone: tz,
    });
    setError(null);
  };

  return (
    <Card>
      <CardContent className="pt-5 space-y-3">
        {/* Current location display */}
        {location && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-sm">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <div className="min-w-0">
              <span className="font-medium">{location.name}</span>
              <span className="text-muted-foreground ml-2 text-xs">
                ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
              </span>
            </div>
          </div>
        )}

        {/* Detect button */}
        <Button
          onClick={detectLocation}
          disabled={loading}
          className="w-full h-11 sm:h-9"
          variant={location ? "outline" : "default"}
          data-testid="detect-location-btn"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {t("detecting")}</>
          ) : (
            <><MapPin className="w-4 h-4 mr-2" /> {location ? t("updateMyLocation") : t("detectMyLocation")}</>
          )}
        </Button>

        {/* Preset cities — horizontal scroll strip */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">{t("orSelectCity")}</p>
          <div
            className="relative"
            style={{
              maskImage: "linear-gradient(to right, black 85%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 85%, transparent 100%)",
            }}
          >
            <div
              className="flex gap-1.5 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {PRESET_LOCATIONS.slice(0, 5).map((loc) => (
                <Button
                  key={loc.name}
                  variant="outline"
                  size="sm"
                  className={`text-xs h-8 shrink-0 ${
                    location?.name === loc.name ? "border-primary bg-primary/10" : ""
                  }`}
                  onClick={() => onLocationChange(loc)}
                  data-testid={`preset-${loc.name.toLowerCase()}`}
                >
                  {loc.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Manual input toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground min-h-[44px] w-full justify-start"
          onClick={() => setShowManual(!showManual)}
        >
          <Search className="w-3 h-3 mr-1" />
          {t("enterManually")}
        </Button>

        {showManual && (
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <Input
              placeholder={t("locationName")}
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              className="text-sm h-9"
              data-testid="input-name"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder={t("latitude")}
                type="number"
                step="any"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                className="text-sm h-9"
                data-testid="input-lat"
              />
              <Input
                placeholder={t("longitude")}
                type="number"
                step="any"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                className="text-sm h-9"
                data-testid="input-lng"
              />
            </div>
            <Button type="submit" size="sm" className="w-full h-10" data-testid="submit-manual-location">
              {t("useCoordinates")}
            </Button>
          </form>
        )}

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        )}
      </CardContent>
    </Card>
  );
}
