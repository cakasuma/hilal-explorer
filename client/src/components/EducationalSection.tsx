import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen } from "lucide-react";

export function EducationalSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        Learn About Hilal Observation
      </h2>

      <Accordion type="multiple" defaultValue={["hilal"]} className="space-y-2">
        <AccordionItem value="hilal" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium py-3">
            What is Hilal?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-2">
            <p>
              <span className="font-medium text-foreground">Hilal</span> (هلال) is the Arabic
              word for the thin crescent moon that appears shortly after a new moon (conjunction).
              It marks the beginning of each month in the Islamic (Hijri) calendar.
            </p>
            <p>
              In Islamic tradition, the sighting of the hilal after sunset determines when a new
              lunar month begins. This is why months like Ramadan and Dhul Hijjah can start on
              different days in different countries — it depends on whether the hilal was observable
              from that location.
            </p>
            <p>
              The hilal is different from the astronomical new moon. The new moon (conjunction)
              is when the moon is closest to the sun in the sky and completely invisible. The hilal
              appears several hours to a day later, when the moon has moved far enough from the sun
              to reflect a thin sliver of light visible to the naked eye.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="altitude" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium py-3">
            What is Moon Altitude?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-2">
            <p>
              <span className="font-medium text-foreground">Altitude</span> (also called elevation)
              is the angle between the moon and the horizon, measured in degrees. An altitude of 0°
              means the moon is at the horizon, and 90° would be directly overhead.
            </p>
            <p>
              For hilal sighting, the moon&apos;s altitude at sunset is crucial. If the moon is below
              the horizon (negative altitude), it has already set and cannot be seen. If it&apos;s
              above the horizon but too low (say, 1-2°), atmospheric haze and brightness from the
              recently-set sun make it extremely difficult to see.
            </p>
            <p>
              Most criteria require a minimum altitude of 2-5° above the horizon at sunset for a
              realistic chance of sighting.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="elongation" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium py-3">
            What is Elongation?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-2">
            <p>
              <span className="font-medium text-foreground">Elongation</span> is the angular
              distance (separation) between the sun and the moon as viewed from Earth, measured
              in degrees.
            </p>
            <p>
              At new moon (conjunction), the elongation is 0° — the moon is right next to the sun
              in the sky. As hours and days pass after conjunction, the moon moves away from the
              sun, increasing the elongation.
            </p>
            <p>
              A minimum elongation of about 6-8° is typically needed for the crescent to be bright
              enough to see with the naked eye. The wider the elongation, the brighter and thicker
              the crescent appears, making it easier to spot.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="differences" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium py-3">
            Why Do Countries Differ?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-2">
            <p>
              Islamic countries and communities use different methods to determine the start of
              lunar months, which is why dates can differ:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <span className="font-medium text-foreground">Physical sighting (Rukyah):</span>
                {" "}Requires actual visual confirmation of the crescent by reliable witnesses.
                Used traditionally and still practiced in Saudi Arabia and others.
              </li>
              <li>
                <span className="font-medium text-foreground">Astronomical calculation (Hisab):</span>
                {" "}Uses mathematical models to predict when the moon will be theoretically visible.
                Countries like Malaysia, Indonesia, and Brunei use the Imkanur Rukyah criteria.
              </li>
              <li>
                <span className="font-medium text-foreground">Combined approach:</span>
                {" "}Some countries use astronomical calculations as a baseline but still require
                physical sighting attempts to confirm.
              </li>
            </ul>
            <p>
              Additionally, local geography matters: different latitudes and longitudes mean the
              moon&apos;s position relative to the horizon varies. A city near the equator may see the
              hilal while a city at a higher latitude cannot, even on the same evening.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="standards" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-medium py-3">
            Visibility Standards Explained
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pb-4 space-y-2">
            <p className="font-medium text-foreground">Malaysia (Imkanur Rukyah):</p>
            <p>
              The official Malaysian/MABIMS criteria requires: moon altitude ≥ 3° and elongation
              ≥ 6.4° at sunset. This is based on decades of research by Malaysian, Indonesian,
              Bruneian, and Singaporean astronomers.
            </p>

            <p className="font-medium text-foreground mt-3">Conservative (Strict Rukyah):</p>
            <p>
              A stricter criteria requiring altitude ≥ 5° and elongation ≥ 8°. This represents
              conditions where the crescent is more reliably visible to trained naked-eye observers,
              typical of traditional rukyah requirements.
            </p>

            <p className="font-medium text-foreground mt-3">Global (Moon Above Horizon):</p>
            <p>
              The simplest check — is the moon above the horizon at sunset? While the moon being
              above the horizon is necessary for any sighting, it is not sufficient alone. The moon
              may be above the horizon but too close to the sun (low elongation) to actually be seen.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
