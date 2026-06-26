function unfoldIcsLines(icsText) {
  return String(icsText || '')
    .replace(/\r\n[ \t]/g, '')
    .replace(/\n[ \t]/g, '')
    .split(/\r?\n/);
}

function parseIcsLine(line) {
  const separatorIndex = line.indexOf(':');

  if (separatorIndex === -1) {
    return null;
  }

  const left = line.slice(0, separatorIndex);
  const value = line.slice(separatorIndex + 1);

  const [rawName, ...paramParts] = left.split(';');
  const name = rawName.toUpperCase();

  const params = {};

  for (const part of paramParts) {
    const [key, paramValue] = part.split('=');
    if (key && paramValue) {
      params[key.toUpperCase()] = paramValue;
    }
  }

  return {
    name,
    params,
    value,
  };
}

function unescapeIcsText(value) {
  return String(value || '')
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function formatDateFromIcsValue(value) {
  if (!value) return null;

  const raw = String(value).trim();

  if (/^\d{8}$/.test(raw)) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  }

  if (/^\d{8}T/.test(raw)) {
    return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
  }

  return null;
}

function addOneDay(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

export function parseIcalEvents(icsText) {
  const lines = unfoldIcsLines(icsText);
  const events = [];

  let currentEvent = null;

  for (const line of lines) {
    const parsedLine = parseIcsLine(line);

    if (!parsedLine) continue;

    if (parsedLine.name === 'BEGIN' && parsedLine.value === 'VEVENT') {
      currentEvent = {};
      continue;
    }

    if (parsedLine.name === 'END' && parsedLine.value === 'VEVENT') {
      if (currentEvent) {
        const checkIn = formatDateFromIcsValue(currentEvent.dtstart);
        const checkOut =
          formatDateFromIcsValue(currentEvent.dtend) ||
          (checkIn ? addOneDay(checkIn) : null);

        if (checkIn && checkOut && checkOut > checkIn) {
          events.push({
            uid: currentEvent.uid || null,
            check_in: checkIn,
            check_out: checkOut,
            summary: currentEvent.summary || null,
            description: currentEvent.description || null,
            status: currentEvent.status || 'CONFIRMED',
          });
        }
      }

      currentEvent = null;
      continue;
    }

    if (!currentEvent) continue;

    if (parsedLine.name === 'UID') {
      currentEvent.uid = parsedLine.value;
    }

    if (parsedLine.name === 'DTSTART') {
      currentEvent.dtstart = parsedLine.value;
    }

    if (parsedLine.name === 'DTEND') {
      currentEvent.dtend = parsedLine.value;
    }

    if (parsedLine.name === 'SUMMARY') {
      currentEvent.summary = unescapeIcsText(parsedLine.value);
    }

    if (parsedLine.name === 'DESCRIPTION') {
      currentEvent.description = unescapeIcsText(parsedLine.value);
    }

    if (parsedLine.name === 'STATUS') {
      currentEvent.status = parsedLine.value.toUpperCase();
    }
  }

  return events;
}
