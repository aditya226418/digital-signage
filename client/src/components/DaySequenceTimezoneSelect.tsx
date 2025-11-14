import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface DaySequenceTimezoneSelectProps {
  timezone: string;
  onTimezoneChange: (timezone: string) => void;
}

const timezones = [
  { value: "org-default", label: "Organization Default" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
  { value: "America/New_York", label: "America/New_York (EST)" },
  { value: "Europe/London", label: "Europe/London (GMT)" },
  { value: "UTC", label: "UTC" },
];

export default function DaySequenceTimezoneSelect({
  timezone,
  onTimezoneChange,
}: DaySequenceTimezoneSelectProps) {
  // Get org default timezone (for now, use browser default)
  const orgDefault = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const displayTimezone = timezone === "org-default" 
    ? `Organization Default (${orgDefault})`
    : timezones.find(tz => tz.value === timezone)?.label || timezone;

  return (
    <div className="space-y-2">
      <Label htmlFor="timezone">Timezone</Label>
      <Select value={timezone} onValueChange={onTimezoneChange}>
        <SelectTrigger id="timezone" className="w-[280px]">
          <SelectValue>{displayTimezone}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {timezones.map((tz) => (
            <SelectItem key={tz.value} value={tz.value}>
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

