import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ResultCard } from "./ResultCard";
import { PRESET_LOCATIONS, computeHilal } from "@/lib/astronomy";
import type { Location, VisibilityStandard } from "@/lib/astronomy";
import { Globe, Plus } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface ComparisonModeProps {
  date: Date;
  standard: VisibilityStandard;
  currentLocation: Location | null;
}

export function ComparisonMode({ date, standard, currentLocation }: ComparisonModeProps) {
  const { t } = useLanguage();
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([
    PRESET_LOCATIONS[0], // Putrajaya
    PRESET_LOCATIONS[1], // Jakarta
    PRESET_LOCATIONS[2], // Mecca
  ]);

  const [showPicker, setShowPicker] = useState(false);

  const toggleLocation = (loc: Location) => {
    setSelectedLocations((prev) => {
      const exists = prev.find((l) => l.name === loc.name);
      if (exists) return prev.filter((l) => l.name !== loc.name);
      if (prev.length >= 6) return prev;
      return [...prev, loc];
    });
  };

  const results = useMemo(() => {
    return selectedLocations.map((loc) => ({
      location: loc,
      result: computeHilal(date, loc),
    }));
  }, [date, selectedLocations]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {t("compareTitle")}
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() => setShowPicker(!showPicker)}
          data-testid="toggle-location-picker"
        >
          <Plus className="w-3 h-3 mr-1" />
          {showPicker ? t("tabResult") : t("tabCompare")}
        </Button>
      </div>

      {showPicker && (
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-muted-foreground mb-3">
              {t("compareSubtitle")} ({selectedLocations.length}/6):
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentLocation && (
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors min-h-[44px]">
                  <Checkbox
                    checked={selectedLocations.some((l) => l.name === currentLocation.name)}
                    onCheckedChange={() => toggleLocation(currentLocation)}
                  />
                  <span className="text-xs">{currentLocation.name} (You)</span>
                </label>
              )}
              {PRESET_LOCATIONS.map((loc) => (
                <label
                  key={loc.name}
                  className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors min-h-[44px]"
                >
                  <Checkbox
                    checked={selectedLocations.some((l) => l.name === loc.name)}
                    onCheckedChange={() => toggleLocation(loc)}
                  />
                  <span className="text-xs">{loc.name}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison summary table */}
      <Card>
        <CardContent className="pt-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-2 font-medium text-muted-foreground">{t("location_col")}</th>
                <th className="text-right py-2 px-2 font-medium text-muted-foreground">{t("sunsetCol")}</th>
                <th className="text-right py-2 px-2 font-medium text-muted-foreground">{t("moonAltCol")}</th>
                <th className="text-right py-2 px-2 font-medium text-muted-foreground">{t("elongationCol")}</th>
                <th className="text-center py-2 px-2 font-medium text-muted-foreground">{t("visibilityCol")}</th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ location, result }) => {
                const vis = standard.check(result);
                const formatTime = (d: Date) => {
                  try {
                    return d.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: location.timezone,
                    });
                  } catch {
                    return d.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                  }
                };
                return (
                  <tr key={location.name} className="border-b border-border/50 last:border-0">
                    <td className="py-2 px-2 font-medium">{location.name}</td>
                    <td className="py-2 px-2 text-right text-muted-foreground">
                      {formatTime(result.sunsetTime)}
                    </td>
                    <td className={`py-2 px-2 text-right font-mono ${
                      result.moonAltitude > 0
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {result.moonAltitude.toFixed(2)}°
                    </td>
                    <td className="py-2 px-2 text-right font-mono">
                      {result.elongation.toFixed(2)}°
                    </td>
                    <td className="py-2 px-2 text-center">
                      <Badge
                        variant={vis.visible ? "default" : "destructive"}
                        className={`text-[10px] px-1.5 py-0 ${
                          vis.visible
                            ? "bg-green-600 hover:bg-green-700 dark:bg-green-500"
                            : ""
                        }`}
                      >
                        {vis.visible ? t("yes") : t("no")}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Detailed cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(({ result }) => (
          <ResultCard
            key={result.location.name}
            result={result}
            standard={standard}
            compact
          />
        ))}
      </div>
    </div>
  );
}
