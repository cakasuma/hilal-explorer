import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Loader2, Search } from "lucide-react";
import type { Location } from "@/lib/astronomy";
import { PRESET_LOCATIONS } from "@/lib/astronomy";

interface LocationPickerProps {
  location: Location | null;
  onLocationChange: (loc: Location) => void;
}

export function LocationPicker({ location, onLocationChange }: LocationPickerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [manualName, setManualName] = useState("");
  const [showManual, setShowManual] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
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
      (err) => {
        setError(`Location access denied. Please select a city or enter coordinates.`);
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
      setError("Please enter valid coordinates (lat: -90 to 90, lng: -180 to 180).");
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
      <CardContent className="pt-5 space-y-4">
        {/* Current location display */}
        {location && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 text-sm">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <div>
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
          className="w-full"
          variant={location ? "outline" : "default"}
          data-testid="detect-location-btn"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Detecting...</>
          ) : (
            <><MapPin className="w-4 h-4 mr-2" /> {location ? "Update" : "Detect"} My Location</>
          )}
        </Button>

        {/* Preset cities */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Or select a city:</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_LOCATIONS.slice(0, 5).map((loc) => (
              <Button
                key={loc.name}
                variant="outline"
                size="sm"
                className={`text-xs h-7 ${
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

        {/* Manual input toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground"
          onClick={() => setShowManual(!showManual)}
        >
          <Search className="w-3 h-3 mr-1" />
          Enter coordinates manually
        </Button>

        {showManual && (
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <Input
              placeholder="Location name (optional)"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              className="text-sm h-8"
              data-testid="input-name"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Latitude"
                type="number"
                step="any"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                className="text-sm h-8"
                data-testid="input-lat"
              />
              <Input
                placeholder="Longitude"
                type="number"
                step="any"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                className="text-sm h-8"
                data-testid="input-lng"
              />
            </div>
            <Button type="submit" size="sm" className="w-full h-8" data-testid="submit-manual-location">
              Use These Coordinates
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
