import { getSelf } from '@/api/users';
import { postConsentSettings, postNotificationSettings, postGoalGrade } from '@/api/student_settings';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from '@/components/particles/loading';
import { Checkbox, Divider, Radio, Space, Switch } from 'antd';
import { FC, ReactElement, useEffect, useState } from 'react';
import { toast } from 'sonner';

const LoadingState: FC = () => (
  <div className='absolute inset-0 w-screen h-screen grid place-content-center'>
    <Loading />
  </div>
);
const ErrorMessage: FC = () => <p>Something went wrong, could not load user</p>;
const StudentSettings: FC = (): ReactElement => {
  const {
    data: self,
    isError: selfIsError,
    isLoading: selfIsLoading,
  } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,
  });

  if (selfIsLoading) return <LoadingState />;
  if (selfIsError || self === undefined || self.settings === undefined ) return <ErrorMessage />;

  return (
    <div className='w-full p-4'>
      <div className='w-3/4 mx-auto'>
        <h1 className='text-4xl mb-4 text-left'>Settings</h1>
        <Notifications notifications={self.settings.notifications}/>
        <Divider />
        <GoalGrade goalGrade={self.settings.goal_grade}/>
        <Divider />
        <Consent consent={self.settings.consent}/>
      </div>
    </div>
  );
};

interface NotificationProps {
  notifications: boolean
}
const Notifications: FC<NotificationProps> = ({notifications}): ReactElement => {

  const queryClient = useQueryClient();
  const { mutate: saveNotifications, status } = useMutation({
    mutationFn: postNotificationSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['self'] });
    },
  });

  // TODO: Add success state.

  useEffect(() => {
    if (status === 'success') {
      toast.success(`Successfully ${notifications ? 'enabled' : 'disabled'} your notifications.`, {
        closeButton: true,
      });
    }
  }, [status]);

  return (
    <>
      <h1 className='text-2xl text-left'>Notifications</h1>
       <div className='flex gap-2 text-left'>
          <p>Enable notifications:</p>
          <Switch
            checked={notifications ?? false}
            onChange={(val) => saveNotifications(val)}
          />
        </div>
      
    </>
  );
};

interface GoalProps {
  goalGrade: number
}

const GoalGrade: FC<GoalProps> = ({goalGrade}): ReactElement => {

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
      <h1 className='text-2xl text-left'>Goal Grade</h1>
      <p className='text-base text-justify'>
        Please indicate the grade you wish to obtain for this course. You can always change your goal at a later stage!
      </p>
      <div className='w-full'>
        <Space className='mx-auto' direction={'vertical'}>
          <Radio.Group
            value={goalGrade}
            onChange={(val) => saveGoalGrade(val.target.value)}
            options={[
              { label: '1', value: 1 },
              { label: '2', value: 2 },
              { label: '3', value: 3 },
              { label: '4', value: 4 },
              { label: '5', value: 5 },
              { label: '6', value: 6 },
              { label: '7', value: 7 },
              { label: '8', value: 8 },
              { label: '9', value: 9 },
              { label: '10', value: 10 },
            ]}
            optionType='button'
          />
        </Space>
      </div>
    </div>
  );
};

interface ConsentProps {
  consent: boolean
}
const Consent: FC<ConsentProps> = ({consent}): ReactElement => {
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
      <h2 className='text-2xl text-left'>Informed Consent</h2>
      <p className='text-base text-justify'>
        Please read the informed consent carefully. You will be asked to accept the informed consent, if declined your
        data will not be processed. You can change your preference at any time.
      </p>

      <div className='prose text-justify m-6 p-2 bg-primary-gray rounded-lg'>
        <h1>IguideME</h1>
        <h2>INFORMED CONSENT</h2>
        <p>
          Dear participant,
          <br />
          We ask for your cooperation in an evaluation study into educational improvement. In this document, the
          so-called "informed consent", we explain this study and you can indicate whether you want to cooperate. Read
          the text below carefully.
        </p>
        <h3>Goal of the research</h3>
        <p>
          The goal of this educational research is to study the effects of the feedback tool “IguideME” and activating
          learning tools (e.g. Perusall) on the learning process.
          <br />
          The results of this research can be used to facilitate your learning process, to improve the design of this
          and other courses, and for scientific publications.
        </p>
        <h3>Research description</h3>
        <p>
          To investigate the effects of using IguideME, personal data (name and student ID) and learning activity data
          will be collected. Based on these data, you will receive personal feedback via the IguideME dashboard in
          Canvas. You will also receive a predicted course grade that will be automatically calculated from the learning
          activity data using an algorithm. To investigate the effects of activating learning tools, the quality of
          assignments will be assessed and the results of a short questionnaire that scores motivation and learning
          behavior will be compared between the beginning and at the end of the course. For presentations purposes, all
          data will be anonymized.
        </p>
        <h3>Voluntariness</h3>
        <p>
          The participation in this research is voluntary. In the case that you decline to participate or stop your
          participation the data that you have generated will not be used in the research. You are free to stop your
          participation in this research without specifying a reason by informing dr. Erwin van Vliet.
        </p>
        <h3>Insurance</h3>
        <p>
          This research brings no risks for your health and safety and in this case the regular liability insurance of
          the University of Amsterdam is valid.
        </p>
        <h3>Additional Information</h3>
        <p>
          In case of any questions about this research please contact: <b>TEACHER NAME</b> (<b>ROLE</b>), phone{' '}
          <b>PHONE-NUMBER</b>, e-mail <b>EMAIL@DOMAIN.XYZ</b>
        </p>
        <h2>CONSENT FORM</h2>
        <p>
          Here you will be asked to sign the Informed consent.
          <ul>
            <li>
              By choosing <i>"Yes"</i> in this form, you declare that you have read the document entitled “informed
              consent IguideME”, understood it, and confirm that you agree with the procedure as described.
              <br />
            </li>
            <li>
              By choosing <i>"No"</i> in the form, you declare that you have read the document entitled “informed
              consent IguideME”, understood it, and confirm that you do not want to participate in this study.
            </li>
          </ul>
        </p>
      </div>

      <Checkbox checked={consent} onChange={(e) => saveConsent(e.target.checked)}>
        I have read and understood the informed consent
      </Checkbox>
    </>
  );
};

// const Consent: FC = (): ReactElement => {
//     return <div style={{maxWidth: 700, margin: '0 auto', boxSizing: 'border-box', padding: 20 }}>
//     <h1>Informed Consent</h1>
//     <p>Please read the informed consent carefully. You will be asked to accept the informed consent, if declined your data will not be processed. You can change your preference at any time.</p>
//     <div style={{ backgroundColor: '#eaeaea', padding: 20, borderRadius: 10 }}
//          dangerouslySetInnerHTML={{__html: consentText}} />

//     <Row justify={"center"} style={{margin: "15px", textAlign: 'center'}}>
//       <Checkbox
//         checked={hasRead}
//         onChange={e => this.setState({ hasRead: e.target.checked })}
//       >
//         I have read and understood the informed consent
//       </Checkbox>

//     </Row>

//     <Row justify={"center"}>

//       <Button style={{ background: color1, borderColor: color1, marginRight: '5px'}} type={"primary"} disabled={!hasRead} onClick={this.handleAccept}>
//         Accept
//       </Button>

//       <Button style={{ background: color2, borderColor: color2, marginLeft: '5px' }} disabled={!hasRead} danger onClick={() => {
//         this.handleDecline();
//         this.setState({ hasRead: false });
//       }}>
//         Decline
//       </Button>
//     </Row>
//   </div>

// }

export default StudentSettings;
