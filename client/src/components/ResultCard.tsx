import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SkyDiagram } from "./SkyDiagram";
import type { HilalResult, VisibilityStandard } from "@/lib/astronomy";
import { estimateHijriDate } from "@/lib/astronomy";
import { CheckCircle, XCircle, Moon, Sun, Compass, HelpCircle } from "lucide-react";
import { useLanguage, HIJRI_MONTH_NAMES_ID } from "@/lib/i18n";

interface ResultCardProps {
  result: HilalResult;
  standard: VisibilityStandard;
  compact?: boolean;
}

export function ResultCard({ result, standard, compact }: ResultCardProps) {
  const { lang, t } = useLanguage();
  const visibility = standard.check(result);
  const hijri = estimateHijriDate(result.date);
  const hijriMonthName = lang === "id"
    ? HIJRI_MONTH_NAMES_ID[(hijri.month - 1) % 12]
    : hijri.monthName;

  const formatTime = (d: Date) => {
    try {
      return d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: result.location.timezone,
      });
    } catch {
      return d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
  };

  const formatDate = (d: Date) => {
    try {
      return d.toLocaleDateString("en-GB", {
        weekday: compact ? undefined : "long",
        year: "numeric",
        month: compact ? "short" : "long",
        day: "numeric",
        timeZone: result.location.timezone,
      });
    } catch {
      return d.toLocaleDateString("en-GB", {
        weekday: compact ? undefined : "long",
        year: "numeric",
        month: compact ? "short" : "long",
        day: "numeric",
      });
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all ${
        visibility.visible
          ? "border-green-500/30 dark:border-green-400/30"
          : "border-red-500/20 dark:border-red-400/20"
      }`}
      data-testid={`result-card-${result.location.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardHeader className={`pb-3 ${compact ? 'px-4 pt-4' : ''}`}>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className={compact ? "text-sm" : "text-base"}>
            {result.location.name}
          </CardTitle>
          <Badge
            variant={visibility.visible ? "default" : "destructive"}
            className={`shrink-0 ${
              visibility.visible
                ? "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                : ""
            }`}
            data-testid={`visibility-badge-${result.location.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {visibility.visible ? (
              <><CheckCircle className="w-3 h-3 mr-1" /> {t("possible")}</>
            ) : (
              <><XCircle className="w-3 h-3 mr-1" /> {t("notPossible")}</>
            )}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-xs text-muted-foreground">
            {formatDate(result.date)} &middot; {hijri.day} {hijriMonthName} {hijri.year} AH (est.)
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="inline-flex items-center opacity-50 hover:opacity-100 transition-opacity focus:outline-none" aria-label="About Hijri date estimate">
                <HelpCircle className="w-3 h-3 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs text-xs">
              {t("hijriTooltip")}
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>

      <CardContent className={compact ? "px-4 pb-4" : ""}>
        {/* Sky Diagram */}
        <div className="mb-4 rounded-lg overflow-hidden border border-border/50">
          <SkyDiagram result={result} compact={compact} />
        </div>

        {/* Data Grid */}
        <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
          <DataRow
            icon={<Sun className="w-3.5 h-3.5 text-amber-500" />}
            label={t("sunset")}
            value={formatTime(result.sunsetTime)}
          />
          <DataRow
            icon={<Moon className="w-3.5 h-3.5 text-blue-300" />}
            label={t("moonAlt")}
            value={`${result.moonAltitude.toFixed(2)}°`}
            highlight={result.moonAltitude > 0 ? "positive" : "negative"}
          />
          <DataRow
            icon={<Compass className="w-3.5 h-3.5 text-purple-400" />}
            label={t("elongation")}
            value={`${result.elongation.toFixed(2)}°`}
          />
          <DataRow
            icon={<Moon className="w-3.5 h-3.5 text-gray-400" />}
            label={t("moonAge")}
            value={`${result.moonAge.toFixed(1)}h`}
          />
          <DataRow
            icon={<Moon className="w-3.5 h-3.5 text-yellow-300" />}
            label={t("illumination")}
            value={`${result.illuminationPct}%`}
          />
          {!compact && (
            <DataRow
              icon={<Compass className="w-3.5 h-3.5 text-teal-400" />}
              label={t("arcOfVision")}
              value={`${result.arcOfVision.toFixed(2)}°`}
              highlight={result.arcOfVision > 0 ? "positive" : "negative"}
            />
          )}
        </div>

        {/* Visibility reason */}
        <div className={`mt-3 px-3 py-2 rounded-md text-xs ${
          visibility.visible
            ? "bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300"
            : "bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300"
        }`}>
          <span className="font-medium">{standard.name}:</span> {visibility.reason}
        </div>
      </CardContent>
    </Card>
  );
}

function DataRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: "positive" | "negative";
}) {
  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded-md bg-muted/50">
      {icon}
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground leading-none mb-0.5">{label}</p>
        <p
          className={`text-xs font-semibold leading-none ${
            highlight === "positive"
              ? "text-green-600 dark:text-green-400"
              : highlight === "negative"
                ? "text-red-600 dark:text-red-400"
                : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
