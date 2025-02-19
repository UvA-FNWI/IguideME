import { http, HttpResponse } from 'msw';

export const courseSettingsHandlers = [
  http.get('/app/peer-groups', () => {
    const peerGroups = CourseSettingsMockData.peerGroups;
    return HttpResponse.json({ min_size: peerGroups.minSize, personalized_peers: peerGroups.personalizedPeerGroups });
  }),

  http.patch('/app/peer-groups', async ({ request }) => {
    const newPeerGroups = await request.json();

    if (newPeerGroups !== null && typeof newPeerGroups === 'object') {
      const peerGroups = CourseSettingsMockData.peerGroups;
      if ('min_size' in newPeerGroups) {
        peerGroups.minSize = newPeerGroups.min_size;
      }
      if ('personalized_peers' in newPeerGroups) {
        peerGroups.personalizedPeerGroups = newPeerGroups.personalized_peers;
      }
    }

    return new HttpResponse(null, { status: 200 });
  }),

  http.get('/app/notifications', () => {
    const notifications = CourseSettingsMockData.notifications;
    return HttpResponse.json({
      isRange: notifications.isRange,
      selectedDates: notifications.selectedDates,
      selectedDays: notifications.selectedDays,
    });
  }),

  http.post('/app/notifications', async ({ request }) => {
    const newNotifications = await request.json();

    if (newNotifications !== null && typeof newNotifications === 'object') {
      const notifications = CourseSettingsMockData.notifications;
      if ('isRange' in newNotifications) {
        notifications.isRange = newNotifications.isRange;
      }
      if ('selectedDates' in newNotifications) {
        notifications.selectedDates = newNotifications.selectedDates;
      }
      if ('selectedDays' in newNotifications) {
        notifications.selectedDays = newNotifications.selectedDays;
      }
    }

    return new HttpResponse(null, { status: 200 });
  }),

  http.get('/app/course-details', () => {
    const courseDetails = CourseSettingsMockData.courseDetails;
    return HttpResponse.json(courseDetails.courseStartDate);
  }),

  http.patch('/app/course-details/:courseStartDate', async ({ params }) => {
    const newCourseStartDate = parseInt(params.courseStartDate as string);
    CourseSettingsMockData.courseDetails.courseStartDate = newCourseStartDate;
    return new HttpResponse(null, { status: 200 });
  }),
];

const CourseSettingsMockData = {
  peerGroups: {
    minSize: 4,
    personalizedPeerGroups: true,
  },
  notifications: {
    isRange: false,
    selectedDates: '2025-02-28, 2025-11-12',
    selectedDays: null,
  },
  courseDetails: {
    courseStartDate: 1722458908,
  },
};
