import { ActionTypes, trackEvent } from '@/utils/analytics';
import { Checkbox, Collapse, Divider, Radio, Space, Switch } from 'antd';
import { postConsentSettings, postGoalGrade, postNotificationSettings } from '@/api/student_settings';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type FC, type ReactElement, useEffect } from 'react';
import { type User, UserRoles } from '@/types/user';
import { useGlobalContext } from '@/components/crystals/layout/GlobalStore/useGlobalStore';
import { useShallow } from 'zustand/react/shallow';

const StudentSettings: FC = (): ReactElement => {
  const { self } = useGlobalContext(useShallow((state) => ({ self: state.self })));

  useEffect(() => {
    if (self.role === UserRoles.student) {
      trackEvent({
        userID: self.userID,
        action: ActionTypes.page,
        actionDetail: 'Student Settings',
        courseID: self.course_id,
      }).catch(() => {
        // Silently fail, since this is not critical
      });
    }
  }, []);

  // TODO: Implement better defaults
  return (
    <div className='w-full p-4'>
      <div className='mx-auto w-3/4'>
        <h1 className='mb-4 text-left text-4xl'>Settings</h1>
        <Notifications notifications={self.settings ? self.settings.notifications : false} user={self} />
        <Divider />
        <GoalGrade goalGrade={self.settings ? self.settings.goal_grade : 0} user={self} />
        <Divider />
        <Consent consent={self.settings ? self.settings.consent : false} />
      </div>
    </div>
  );
};

interface NotificationProps {
  notifications: boolean;
  user: User;
}

const Notifications: FC<NotificationProps> = ({ notifications, user }): ReactElement => {
  const queryClient = useQueryClient();
  const { mutate: saveNotifications, status } = useMutation({
    mutationFn: postNotificationSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['self'] });

      if (user.role === UserRoles.student) {
        trackEvent({
          userID: user.userID,
          action: ActionTypes.notifications,
          actionDetail: notifications ? 'Enabled Notifications' : 'Disabled Notifications',
          courseID: user.course_id,
        }).catch(() => {
          // Silently fail, since this is not critical
        });
      }
    },
  });

  useEffect(() => {
    if (status === 'success') {
      toast.success(`Successfully ${notifications ? 'enabled' : 'disabled'} your notifications.`, {
        closeButton: true,
      });
    }
  }, [status]);

  return (
    <>
      <h1 className='text-left text-2xl'>Notifications</h1>
      <div className='flex gap-2 text-left'>
        <p>Enable notifications:</p>
        <Switch
          checked={notifications ?? false}
          onChange={(val) => {
            saveNotifications(val);
          }}
        />
      </div>
    </>
  );
};

interface GoalProps {
  goalGrade: number;
  user: User;
}

const GoalGrade: FC<GoalProps> = ({ goalGrade, user }): ReactElement => {
  const queryClient = useQueryClient();
  const { mutate: saveGoalGrade, status } = useMutation({
    mutationFn: postGoalGrade,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['self'] });
    },
  });

  useEffect(() => {
    if (status === 'success') {
      toast.success(`Successfully updated your goal grade to ${goalGrade}.`, {
        closeButton: true,
      });
    }
  }, [status]);

  return (
    <div id={'desiredGrade'}>
      <h1 className='text-left text-2xl'>Goal Grade</h1>
      <p className='text-justify text-text'>
        Please indicate the grade you wish to obtain for this course. You can always change your goal at a later stage!
      </p>
      <div className='mt-2 w-full'>
        <Space className='mx-auto' direction={'vertical'}>
          <Radio.Group
            value={goalGrade}
            onChange={(val) => {
              saveGoalGrade(Number(val.target.value));
              if (user.role === UserRoles.student) {
                trackEvent({
                  userID: user.userID,
                  action: ActionTypes.settingChange,
                  actionDetail: `Change Goal Grade: ${val.target.value}`,
                  courseID: user.course_id,
                }).catch(() => {
                  // Silently fail, since this is not critical
                });
              }
            }}
            options={Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }))}
            optionType='button'
          />
        </Space>
      </div>
    </div>
  );
};

interface ConsentProps {
  consent: boolean;
}
const Consent: FC<ConsentProps> = ({ consent }): ReactElement => {
  const queryClient = useQueryClient();
  const { mutate: saveConsent, status } = useMutation({
    mutationFn: postConsentSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['self'] });
    },
  });

  useEffect(() => {
    if (status === 'success') {
      toast.success(`Successfully ${consent ? 'registered' : 'withdrawn'} your consent.`, {
        closeButton: true,
      });
    }
  }, [status]);

  return (
    <>
      <h2 className='text-left text-2xl'>Informed Consent</h2>
      <Collapse
        bordered={false}
        className='[&>div>div]:!p-0'
        ghost
        items={[
          {
            key: 1,
            label: (
              <>
                <p className='text-justify text-text'>
                  Please read the informed consent carefully. You will be asked to accept the informed consent, if
                  declined your data will not be processed. You can change your preference at any time.
                  <span className='sr-only'>Click anywhere on this text to open the informed consent.</span>
                </p>
              </>
            ),
            children: <ConsentText />,
            showArrow: true,
          },
        ]}
      />

      <Checkbox
        className='mt-4'
        checked={consent}
        onChange={(e) => {
          saveConsent(e.target.checked);
        }}
      >
        <p>I have read and understood the informed consent</p>
      </Checkbox>
    </>
  );
};

const ConsentText: FC = () => (
  <div className='prose rounded-lg bg-subtext1 p-2 text-justify prose-h1:text-text prose-h2:text-text prose-h3:text-text'>
    <h1>IguideME</h1>
    <h2>INFORMED CONSENT</h2>
    <p>
      Dear participant,
      <br />
      We ask for your cooperation in an evaluation study into educational improvement. In this document, the so-called
      &quot;informed consent&quot;, we explain this study and you can indicate whether you want to cooperate. Read the
      text below carefully.
    </p>
    <h3>Goal of the research</h3>
    <p>
      The goal of this educational research is to study the effects of the feedback tool “IguideME” and activating
      learning tools (e.g. Perusall) on the learning process.
      <br />
      The results of this research can be used to facilitate your learning process, to improve the design of this and
      other courses, and for scientific publications.
    </p>
    <h3>Research description</h3>
    <p>
      To investigate the effects of using IguideME, personal data (name and student ID) and learning activity data will
      be collected. Based on these data, you will receive personal feedback via the IguideME dashboard in Canvas. You
      will also receive a predicted course grade that will be automatically calculated from the learning activity data
      using an algorithm. To investigate the effects of activating learning tools, the quality of assignments will be
      assessed and the results of a short questionnaire that scores motivation and learning behavior will be compared
      between the beginning and at the end of the course. For presentations purposes, all data will be anonymized.
    </p>
    <h3>Voluntariness</h3>
    <p>
      The participation in this research is voluntary. In the case that you decline to participate or stop your
      participation the data that you have generated will not be used in the research. You are free to stop your
      participation in this research without specifying a reason by informing dr. Erwin van Vliet.
    </p>
    <h3>Insurance</h3>
    <p>
      This research brings no risks for your health and safety and in this case the regular liability insurance of the
      University of Amsterdam is valid.
    </p>
    <h3>Additional Information</h3>
    <p>
      In case of any questions about this research please contact: <b>TEACHER NAME</b> (<b>ROLE</b>), phone{' '}
      <b>PHONE-NUMBER</b>, e-mail <b>EMAIL@DOMAIN.XYZ</b>
    </p>
    <h2>CONSENT FORM</h2>
    <p>Here you will be asked to sign the Informed consent.</p>
    <ul>
      <li className='text-text'>
        By choosing <i>&quot;Yes&quot;</i> in this form, you declare that you have read the document entitled “informed
        consent IguideME”, understood it, and confirm that you agree with the procedure as described.
        <br />
      </li>
      <li className='text-text'>
        By choosing <i>&quot;No&quot;</i> in the form, you declare that you have read the document entitled “informed
        consent IguideME”, understood it, and confirm that you do not want to participate in this study.
      </li>
    </ul>
  </div>
);

export default StudentSettings;
