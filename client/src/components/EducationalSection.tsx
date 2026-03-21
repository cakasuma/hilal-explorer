import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function EducationalSection() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        {t("learnTitle")}
      </h2>

      <Accordion type="multiple" defaultValue={["hilal", "date-discrepancy"]} className="space-y-2">
        <AccordionItem value="hilal" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium py-3">
            {t("whatIsHilal")}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-2">
            <p>
              <span className="font-medium text-foreground">Hilal</span> (هلال) —{" "}
              {t("whatIsHilalP1")}
            </p>
            <p>{t("whatIsHilalP2")}</p>
            <p>{t("whatIsHilalP3")}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="date-discrepancy" className="border rounded-lg px-4 border-amber-200 dark:border-amber-800/40 bg-amber-50/30 dark:bg-amber-950/10">
          <AccordionTrigger className="text-sm font-medium py-3 text-amber-900 dark:text-amber-300">
            {t("dateDiscrepancyTitle")}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-3">
            <p>{t("dateDiscrepancyP1")}</p>

            <div className="space-y-2">
              <p className="font-medium text-foreground">{t("dateDiscrepancyWhyTitle")}</p>
              <ul className="space-y-1.5 ml-2">
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  <span>{t("dateDiscrepancyB1")}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  <span>{t("dateDiscrepancyB2")}</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  <span>
                    {t("dateDiscrepancyB3")}
                    <ol className="mt-1.5 ml-3 space-y-1">
                      <li className="flex gap-2">
                        <span className="shrink-0">1.</span>
                        <span>{t("dateDiscrepancyB3a")}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="shrink-0">2.</span>
                        <span>{t("dateDiscrepancyB3b")}</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="shrink-0">3.</span>
                        <span>{t("dateDiscrepancyB3c")}</span>
                      </li>
                    </ol>
                  </span>
                </li>
              </ul>
            </div>

            <div className="px-3 py-2.5 rounded-md bg-amber-100/60 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 space-y-1.5">
              <p className="font-medium text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wide">
                {t("dateDiscrepancyExampleTitle")}
              </p>
              <p className="text-xs">{t("dateDiscrepancyExample")}</p>
            </div>

            <p className="italic text-xs border-l-2 border-primary/40 pl-3">
              {t("dateDiscrepancyConclusion")}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="altitude" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium py-3">
            {t("whatIsAltitude")}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-2">
            <p>
              <span className="font-medium text-foreground">{t("moonAlt")}</span> —{" "}
              {t("whatIsAltitudeP1")}
            </p>
            <p>{t("whatIsAltitudeP2")}</p>
            <p>{t("whatIsAltitudeP3")}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="elongation" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium py-3">
            {t("whatIsElongation")}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-2">
            <p>
              <span className="font-medium text-foreground">{t("elongation")}</span> —{" "}
              {t("whatIsElongationP1")}
            </p>
            <p>{t("whatIsElongationP2")}</p>
            <p>{t("whatIsElongationP3")}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="differences" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium py-3">
            {t("whyCountriesDiffer")}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-2">
            <p>{t("whyCountriesDifferIntro")}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <span className="font-medium text-foreground">{t("rukyahLabel")}</span>
                {" "}{t("rukyahDesc")}
              </li>
              <li>
                <span className="font-medium text-foreground">{t("hisabLabel")}</span>
                {" "}{t("hisabDesc")}
              </li>
              <li>
                <span className="font-medium text-foreground">{t("combinedLabel")}</span>
                {" "}{t("combinedDesc")}
              </li>
            </ul>
            <p>{t("geographyNote")}</p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="standards" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium py-3">
            {t("standardsTitle")}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-2">
            <p className="font-medium text-foreground">{t("malaysiaStandard")}</p>
            <p>{t("malaysiaStandardDesc")}</p>

            <p className="font-medium text-foreground mt-3">{t("conservativeStandard")}</p>
            <p>{t("conservativeStandardDesc")}</p>

            <p className="font-medium text-foreground mt-3">{t("istanbulStandard")}</p>
            <p>{t("istanbulStandardDesc")}</p>

            <p className="font-medium text-foreground mt-3">{t("globalStandard")}</p>
            <p>{t("globalStandardDesc")}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
