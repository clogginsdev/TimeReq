import { google } from '@googleapis/calendar';

// Configure Google Calendar API
const calendar = google.calendar({
  version: 'v3',
  auth: new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar.events'],
  }),
});

export async function createGoogleCalendarEvent({ start, duration, title, description, attendees }) {
  const event = {
    summary: title,
    description,
    start: {
      dateTime: new Date(...start).toISOString(),
      timeZone: 'America/Chicago',
    },
    end: {
      dateTime: new Date(new Date(...start).getTime() + duration.minutes * 60000).toISOString(),
      timeZone: 'America/Chicago',
    },
    attendees: attendees.map(({ email, name }) => ({ email, displayName: name })),
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(7),
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    throw error;
  }
}
