import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LocationPicker } from "@/components/LocationPicker";
import { ResultCard } from "@/components/ResultCard";
import { ComparisonMode } from "@/components/ComparisonMode";
import { EducationalSection } from "@/components/EducationalSection";
import { TimelineSlider } from "@/components/TimelineSlider";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { computeHilal, VISIBILITY_STANDARDS, PRESET_LOCATIONS } from "@/lib/astronomy";
import type { Location } from "@/lib/astronomy";
import { useTheme } from "@/lib/theme";
import { Moon as MoonIcon, Sun as SunIcon, Info, BarChart3 } from "lucide-react";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [location, setLocation] = useState<Location | null>(PRESET_LOCATIONS[0]);
  const [standardId, setStandardId] = useState("malaysia");
  const [dayOffset, setDayOffset] = useState(0);
  const [showTimeline, setShowTimeline] = useState(true);

  const selectedDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [dayOffset]);

  const standard = useMemo(() => {
    return VISIBILITY_STANDARDS.find((s) => s.id === standardId) || VISIBILITY_STANDARDS[0];
  }, [standardId]);

  const result = useMemo(() => {
    if (!location) return null;
    return computeHilal(selectedDate, location);
  }, [selectedDate, location]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Crescent moon SVG logo */}
            <svg
              viewBox="0 0 32 32"
              className="w-7 h-7"
              aria-label="Hilal Explorer logo"
              fill="none"
            >
              <circle cx="16" cy="16" r="14" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" />
              <path
                d="M20 6a12 12 0 0 0 0 20 14 14 0 1 1 0-20z"
                fill="hsl(var(--accent))"
                opacity="0.9"
              />
              <circle cx="10" cy="10" r="1" fill="hsl(var(--accent))" opacity="0.4" />
              <circle cx="7" cy="18" r="0.7" fill="hsl(var(--accent))" opacity="0.3" />
              <circle cx="14" cy="6" r="0.5" fill="hsl(var(--accent))" opacity="0.3" />
            </svg>
            <div>
              <h1 className="text-base font-bold leading-none">Hilal Explorer</h1>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                Educational Moon Sighting Tool
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-8 w-8 p-0"
            data-testid="theme-toggle"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <SunIcon className="w-4 h-4" />
            ) : (
              <MoonIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Disclaimer */}
        <div className="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p>
            This app is for educational purposes only and does not replace official announcements
            from religious authorities regarding the start of Islamic months.
          </p>
        </div>

        {/* Controls row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Location */}
          <div className="md:col-span-1">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Location
            </h3>
            <LocationPicker location={location} onLocationChange={setLocation} />
          </div>

          {/* Settings */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
              Settings
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label className="text-xs mb-1.5 block">Visibility Standard</Label>
                <Select value={standardId} onValueChange={setStandardId}>
                  <SelectTrigger className="h-9" data-testid="standard-selector">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VISIBILITY_STANDARDS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[10px] text-muted-foreground mt-1">{standard.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={showTimeline}
                  onCheckedChange={setShowTimeline}
                  id="timeline-toggle"
                  data-testid="timeline-toggle"
                />
                <Label htmlFor="timeline-toggle" className="text-xs">
                  Timeline
                </Label>
              </div>
            </div>

            {/* Timeline slider */}
            {showTimeline && location && (
              <TimelineSlider
                baseDate={new Date()}
                location={location}
                standard={standard}
                dayOffset={dayOffset}
                onDayOffsetChange={setDayOffset}
              />
            )}
          </div>
        </div>

        {/* Tabs: Result / Comparison / Learn */}
        <Tabs defaultValue="result" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="result" data-testid="tab-result">
              <MoonIcon className="w-3.5 h-3.5 mr-1.5" /> Result
            </TabsTrigger>
            <TabsTrigger value="compare" data-testid="tab-compare">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Compare
            </TabsTrigger>
            <TabsTrigger value="learn" data-testid="tab-learn">
              <Info className="w-3.5 h-3.5 mr-1.5" /> Learn
            </TabsTrigger>
          </TabsList>

          <TabsContent value="result">
            {result ? (
              <div className="max-w-lg">
                <ResultCard result={result} standard={standard} />
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <MoonIcon className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a location to see hilal visibility data.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="compare">
            <ComparisonMode
              date={selectedDate}
              standard={standard}
              currentLocation={location}
            />
          </TabsContent>

          <TabsContent value="learn">
            <EducationalSection />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-6 text-center space-y-2">
        <p className="text-[10px] text-muted-foreground">
          Astronomical calculations powered by{" "}
          <a
            href="https://github.com/cosinekitty/astronomy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            astronomy-engine
          </a>
          . Hijri dates are algorithmic estimates.
        </p>
        <p className="text-[10px] text-muted-foreground italic">
          This app does not declare the start of Ramadan, Eid, or any religious dates as authoritative.
        </p>
        <PerplexityAttribution />
      </footer>
    </div>
  );
}
