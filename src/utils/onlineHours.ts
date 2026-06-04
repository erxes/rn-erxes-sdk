type OnlineHour = {
  day: string;
  from: string;
  to: string;
};

type FormatOnlineHoursOptions = {
  onlineHours?: OnlineHour[];
  timezone?: string;
  showTimezone?: boolean;
};

export const AVAILABILITY_MESSAGE =
  "We're available between 9.00 am and 6.00 pm (GMT +8). We'll get back to you as soon as possible.";

const parseTime = (timeString: string): { hour: number; minute: number } => {
  const normalized = timeString.toLowerCase().trim();
  const colonIndex = normalized.indexOf(':');

  if (colonIndex === -1) {
    throw new Error(`Invalid time format: ${timeString}`);
  }

  let hour = Number.parseInt(normalized.substring(0, colonIndex), 10);
  const minute = Number.parseInt(
    normalized.substring(colonIndex + 1, colonIndex + 3),
    10
  );

  const isPM = normalized.includes('pm');
  const isAM = normalized.includes('am');

  if (isPM && hour !== 12) {
    hour += 12;
  } else if (isAM && hour === 12) {
    hour = 0;
  }

  return { hour, minute };
};

const formatTimeTo12Hour = (timeString: string): string => {
  const { hour, minute } = parseTime(timeString);
  const hour12 = hour > 12 ? hour - 12 : hour || 12;
  const period = hour < 12 ? 'am' : 'pm';
  const minuteStr = minute.toString().padStart(2, '0');

  return `${hour12}.${minuteStr} ${period}`;
};

const formatTimeZoneLabel = (timezone: string): string => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date());
    const value = parts.find((part) => part.type === 'timeZoneName')?.value;

    return value || timezone;
  } catch {
    return timezone;
  }
};

const formatTimezone = (timezone?: string, showTimezone?: boolean): string => {
  if (!showTimezone || !timezone) {
    return '';
  }

  const timezoneLabel = formatTimeZoneLabel(timezone);
  const gmtMatch = timezoneLabel.match(/GMT([+-])(\d{1,2}):?(\d{0,2})/);

  if (!gmtMatch) {
    return ` (${timezoneLabel})`;
  }

  const signPart = gmtMatch[1];
  const hourPart = gmtMatch[2];

  if (!signPart || !hourPart) {
    return ` (${timezoneLabel})`;
  }

  const sign = signPart === '+' ? '+' : '-';
  const hours = Number.parseInt(hourPart, 10);
  const minutes = gmtMatch[3] ? Number.parseInt(gmtMatch[3], 10) : 0;

  return minutes === 0
    ? ` (GMT ${sign}${hours})`
    : ` (GMT ${sign}${hours}:${minutes.toString().padStart(2, '0')})`;
};

export const formatOnlineHours = ({
  onlineHours,
  timezone,
  showTimezone,
}: FormatOnlineHoursOptions): {
  workHours: string;
  formattedTimeZone: string;
  onlineDays: string;
} | null => {
  const firstHour = onlineHours?.[0];

  if (!firstHour?.from || !firstHour?.to) {
    return null;
  }

  try {
    return {
      workHours: `${formatTimeTo12Hour(
        firstHour.from
      )} and ${formatTimeTo12Hour(firstHour.to)}`,
      formattedTimeZone: formatTimezone(timezone, showTimezone).trim(),
      onlineDays: onlineHours?.map((item) => item.day).join(', ') || '',
    };
  } catch {
    return {
      workHours: `${firstHour.from} and ${firstHour.to}`,
      formattedTimeZone: formatTimezone(timezone, showTimezone).trim(),
      onlineDays: onlineHours?.map((item) => item.day).join(', ') || '',
    };
  }
};

export const formatOnlineHoursShort = ({
  onlineHours,
  timezone,
  showTimezone,
}: FormatOnlineHoursOptions): string => {
  const firstHour = onlineHours?.[0];

  if (!firstHour?.from || !firstHour?.to) {
    return '';
  }

  try {
    const from = formatTimeTo12Hour(firstHour.from)
      .replace(/\s+/g, '')
      .replace('.00', '');
    const to = formatTimeTo12Hour(firstHour.to)
      .replace(/\s+/g, '')
      .replace('.00', '');

    let timezoneSuffix = '';

    if (showTimezone && timezone) {
      const timezoneLabel = formatTimeZoneLabel(timezone);
      const gmtMatch = timezoneLabel.match(
        /(?:\()?GMT([+-])(\d{1,2}):?(\d{0,2})(?:\))?/
      );

      if (gmtMatch?.[1] && gmtMatch[2]) {
        const sign = gmtMatch[1];
        const hours = Number.parseInt(gmtMatch[2], 10);
        const minutes = gmtMatch[3] ? Number.parseInt(gmtMatch[3], 10) : 0;
        const minutePart =
          minutes === 0 ? '' : `:${minutes.toString().padStart(2, '0')}`;

        timezoneSuffix = ` (GMT${sign}${hours}${minutePart})`;
      }
    }

    return `${from}-${to}${timezoneSuffix}`;
  } catch {
    return `${firstHour.from}-${firstHour.to}`;
  }
};
