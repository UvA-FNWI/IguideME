import { http, HttpResponse } from 'msw';

import { basePath } from '@/mocks/base-path';

import { exampleConsent, exampleNotification, examplePeerGroup } from './course-setting-example-data';

export const courseSettingHandlers = [
  // ------
  // Peer Group
  // ------

  http.get(basePath('api/course/setting/peer-group'), () => {
    return HttpResponse.json(examplePeerGroup);
  }),

  http.post(basePath('api/course/setting/peer-group'), async ({ request }) => {
    const newPeerGroupSetting = await request.json();

    examplePeerGroup.min_size = (
      newPeerGroupSetting as {
        min_size: number;
        personalized_peers: boolean;
      }
    ).min_size;

    examplePeerGroup.personalized_peers = (
      newPeerGroupSetting as {
        min_size: number;
        personalized_peers: boolean;
      }
    ).personalized_peers;

    return HttpResponse.json(examplePeerGroup, { status: 201 });
  }),

  // ------
  // Consent
  // ------

  http.get(basePath('api/course/setting/consent'), () => {
    return HttpResponse.json(exampleConsent);
  }),

  http.post(basePath('api/course/setting/consent'), async ({ request }) => {
    const newConsentSetting = await request.json();

    exampleConsent.course_name = (
      newConsentSetting as {
        course_name: string;
        text: string;
      }
    ).course_name;

    exampleConsent.text = (
      newConsentSetting as {
        course_name: string;
        text: string;
      }
    ).text;

    return HttpResponse.json(exampleConsent, { status: 201 });
  }),

  // ------
  // Notification
  // ------

  http.get(basePath('api/course/setting/notification'), () => {
    return HttpResponse.json(exampleNotification);
  }),

  http.post(basePath('api/course/setting/notification'), async ({ request }) => {
    const newNotificationSetting = await request.json();

    exampleNotification.push(newNotificationSetting as string);

    return HttpResponse.json(exampleNotification, { status: 201 });
  }),
];
