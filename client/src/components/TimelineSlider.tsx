import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { computeHilalRange } from "@/lib/astronomy";
import type { Location, VisibilityStandard } from "@/lib/astronomy";
import { Calendar } from "lucide-react";

interface TimelineSliderProps {
  baseDate: Date;
  location: Location;
  standard: VisibilityStandard;
  dayOffset: number;
  onDayOffsetChange: (offset: number) => void;
}

const RANGE_DAYS = 15;

export function TimelineSlider({
  baseDate,
  location,
  standard,
  dayOffset,
  onDayOffsetChange,
}: TimelineSliderProps) {
  const startDate = useMemo(() => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - 7);
    return d;
  }, [baseDate]);

  const rangeResults = useMemo(() => {
    return computeHilalRange(startDate, RANGE_DAYS, location);
  }, [startDate, location]);

  const currentDate = useMemo(() => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [baseDate, dayOffset]);

  const formatShortDate = (d: Date) => {
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  return (
    <Card>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            Timeline View
          </h3>
          <span className="text-xs text-muted-foreground">
            {formatShortDate(currentDate)}
          </span>
        </div>

        {/* Mini chart showing altitude over days */}
        <div className="h-16 relative">
          <svg viewBox={`0 0 ${RANGE_DAYS * 20} 60`} className="w-full h-full">
            {/* Zero line */}
            <line
              x1="0" y1="30" x2={RANGE_DAYS * 20} y2="30"
              stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="2,2"
            />
            
            {/* Altitude bars */}
            {rangeResults.map((r, i) => {
              const vis = standard.check(r);
              const altClamped = Math.max(-10, Math.min(20, r.moonAltitude));
              const barHeight = (altClamped / 20) * 25;
              const x = i * 20 + 3;
              const isSelected = i === dayOffset + 7;
              
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={barHeight >= 0 ? 30 - barHeight : 30}
                    width="14"
                    height={Math.abs(barHeight) || 1}
                    rx="2"
                    fill={
                      vis.visible
                        ? isSelected ? "hsl(162, 63%, 35%)" : "hsl(162, 50%, 45%)"
                        : isSelected ? "hsl(0, 72%, 45%)" : "hsl(0, 40%, 55%)"
                    }
                    opacity={isSelected ? 1 : 0.5}
                  />
                  {isSelected && (
                    <rect
                      x={x - 1}
                      y={0}
                      width="16"
                      height="60"
                      fill="none"
                      stroke="hsl(var(--foreground))"
                      strokeWidth="1"
                      rx="3"
                      opacity={0.3}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <Slider
          min={-7}
          max={7}
          step={1}
          value={[dayOffset]}
          onValueChange={([val]) => onDayOffsetChange(val)}
          data-testid="timeline-slider"
        />

        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>-7 days</span>
          <span className="font-medium text-foreground">Today</span>
          <span>+7 days</span>
        </div>
      </CardContent>
    </Card>
  );
}
