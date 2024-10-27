import { postConsentSettings, postGoalGrade, postNotificationSettings } from '@/api/student_settings';
import { getSelf } from '@/api/users';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { ConsentEnum, type User, UserRoles } from '@/types/user';
import { ActionTypes, trackEvent } from '@/utils/analytics';
import { useRequiredParams } from '@/utils/params';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Checkbox, Collapse, Radio, Switch } from 'antd';
import { type FC, type ReactElement, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

const StudentSettings: FC = (): ReactElement => {
  const { courseId, studentId } = useRequiredParams(['courseId', 'studentId']);

  const {
    data: self,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,
  });

  useEffect(() => {
    if (self?.role === UserRoles.student) {
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

  if (self?.role !== UserRoles.student) return <Navigate to={`/${courseId}/${studentId}`} replace />;

  return (
    <QueryLoading isLoading={isLoading}>
      <div className='flex w-full flex-col gap-4 p-4'>
        <h1 className='text-4xl'>Settings</h1>
        {isError ?
          <QueryError className='relative' title='Failed to load students.' />
        : <>
            <Notifications notifications={self.settings ? self.settings.notifications : false} user={self} />
            <GoalGrade goalGrade={self.settings ? self.settings.goal_grade : 0} user={self} />
            <Consent consent={self.settings ? self.settings.consent : ConsentEnum.None} />
          </>
        }
      </div>
    </QueryLoading>
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

      trackEvent({
        userID: user.userID,
        action: ActionTypes.notifications,
        actionDetail: notifications ? 'Enabled Notifications' : 'Disabled Notifications',
        courseID: user.course_id,
      }).catch(() => {
        // Silently fail, since this is not critical
      });
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
    <div>
      <h1 className='mb-2 text-2xl'>Notifications</h1>
      <div className='flex gap-2'>
        <p>Enable notifications:</p>
        <Switch
          className='custom-switch bg-surface2 hover:!bg-surface2/25'
          checked={notifications}
          onChange={(val) => {
            saveNotifications(val);
          }}
        />
      </div>
    </div>
  );
};

interface GoalProps {
  goalGrade: number;
  user: User;
}

const GoalGrade: FC<GoalProps> = ({ goalGrade, user }): ReactElement => {
  const [currentGoalGrade, setCurrentGoalGrade] = useState<number>(goalGrade);

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
    <div id='desiredGrade'>
      <h1 className='mb-2 text-2xl'>Goal Grade</h1>
      <p className='text-justify'>
        Please indicate the grade you wish to obtain for this course. You can always change your goal at a later stage!
      </p>
      <div className='mt-2 w-full'>
        <Radio.Group
          className='custom-radio-group flex w-full flex-nowrap overflow-x-auto overflow-y-hidden'
          value={currentGoalGrade}
          onChange={(val) => {
            const newGoalGrade = Number(val.target.value);
            setCurrentGoalGrade(newGoalGrade);
            saveGoalGrade(newGoalGrade);

            trackEvent({
              userID: user.userID,
              action: ActionTypes.settingChange,
              actionDetail: `Change Goal Grade: ${val.target.value}`,
              courseID: user.course_id,
            }).catch(() => {
              // Silently fail, since this is not critical
            });
          }}
          options={Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1}`, value: i + 1 }))}
          optionType='button'
        />
      </div>
    </div>
  );
};

interface ConsentProps {
  consent: ConsentEnum;
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
    <div>
      <h2 className='mb-2 text-2xl'>Informed Consent</h2>
      <Collapse
        bordered={false}
        className='[&_svg]:!text-text [&>div>div]:!p-0'
        ghost
        items={[
          {
            key: 1,
            label: (
              <>
                <p className='text-text text-justify'>
                By accepting the informed consent, I declare that I have read the document entitled “informed consent IguideME”,
                understood it, and consent to my personal data being processed for the purposes stated above.<br/>
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
        className='custom-checkbox mt-4'
        checked={consent === ConsentEnum.Accepted}
        onChange={(e) => {
          saveConsent(e.target.checked ? 1 : 2);
        }}
      >
        <p>I have read and understood the informed consent</p>
      </Checkbox>
    </div>
  );
};

const ConsentText: FC = () => (
  <div className='prose bg-surface2 prose-h1:text-text prose-h2:text-text prose-h3:text-text w-full rounded-lg p-2 text-justify'>
    <h1>IguideME</h1>
    <h2>INFORMED CONSENT IGUIDEME</h2>
    <p>
      Dear Learner,
      <br />
      In this document, the so-called &quot;informed consent&quot;, the goal of the personalized feedback tool IguideME will be explained,
      as well as which data will be collected to support your learning process, and how the tool works. Read the text below
      carefully.
    </p>
    <h3>Goal</h3>
    <p>
    The goal of “IguideME” is to provide insight into the learning process, the learning outcomes and the use of study materials
    via personalized feedback to students and lecturers. Previous research has shown that IguideME supports self-regulated
    learning and academic achievement. In other words, you may benefit from IguideME by becoming a more active participant
    of your own learning process and score higher grades.
    <br />
    <br />
    For more details see <a>https://doi.org/10.18608/jla.2023.7853</a>.
      <br /><br/>
      By tracking your progress and the use of study materials the lecturer can further support your learning process and optimize
      course didactics.
    </p>
    <h3>Data collection, peer comparison and personalized feedback</h3>
    <p>
    IguideME collects personal data (name and student ID) as well as learning activity data (e.g., grades for assignments that do
    and do not count towards the final grade or derivatives thereof e.g., quality of submitted assignments or number of submitted
    assignments) from the digital learning environment (Canvas) as well as from other tools that are used in the course.
    Furthermore, usage analytics will be performed (e.g., total visits, page visits and session length within IguideME) which are
    only visible for the lecturer.
    <br /><br/>
    Based on a goal grade that you provide in IguideME, you will be compared to peers with a comparable grade (peer-comparison)
    and receive personalized feedback via notifications in the digital learning environment  and/or e-mail about learning activities
    performed. You may also receive a predicted course grade that will be automatically calculated from the learning activity data
    using historical data. Your personal data will not be shown to other students but will be used to calculate the average
    performance of the peer group and this average will be shown in the dashboard. The lecturer receives an overview of all
    personalized data and may contact you in case your learning performance is lagging behind.
    </p>
    <h3>Voluntariness</h3>
    <p>
    The use of IguideME is voluntary. By changing the consent from “yes” into “no”, the data that you have generated will be
    removed from IguideME.
    </p>
    <h3>Insurance</h3>
    <p>
    The regular liability insurance of the University of Amsterdam is valid.
    </p>
    <h3>Additional Information</h3>
    <p>
    In case of any questions about IguideME, please contact dr. Erwin (E.A.) van Vliet, e.a.vanvliet@uva.nl
    </p>
    <h2>CONSENT FORM</h2>
    <p>Here you will be asked to sign the Informed consent. </p>
    <ul>
      <li className='text-text'>
        Door in dit formulier <i>&quot;Ja&quot;</i> te kiezen, verklaar je dat je het document getiteld &quot;informed
        consent Slimmer Collegejaar&quot; hebt gelezen en begrepen en dat je akkoord gaat met de procedure zoals
        beschreven.
      </li>
      <li className='text-text'>
        Door in dit formulier <i>&quot;Nee&quot;</i> te kiezen, verklaart je dat je het document met de titel
        &quot;informed consent Slimmer Collegejaar&quot; hebt gelezen en begrepen en bevestigt dat je niet aan dit
        onderzoek wilt deelnemen.
      </li>
    </ul>
  </div>
);

export { ConsentText, GoalGrade };
export default StudentSettings;
