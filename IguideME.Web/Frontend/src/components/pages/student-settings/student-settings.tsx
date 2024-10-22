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
                  &quot;Ik verklaar dat ik de informatie heb gelezen en begrepen. Ik geef toestemming voor deelname aan
                  dit onderwijsonderzoek en het gebruik van mijn gegevens daarin. Ik behoud mijn recht om deze
                  toestemming stop te zetten zonder een expliciete reden op te geven en om mijn deelname aan dit
                  experiment op elk moment stop te zetten.&quot;
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
    <h2>INFORMED CONSENT SLIMMER COLLEGEJAAR</h2>
    <p>
      Beste deelnemer,
      <br />
      Wij vragen je medewerking aan onderzoek naar onderwijsverbetering. In dit document, de zogenaamde &apos;informed
      consent&apos;, wordt het onderzoek uitgelegd en kun je aangeven of je mee wilt werken. Lees onderstaande tekst
      goed door.
    </p>
    <h3>DOEL VAN HET ONDERZOEK</h3>
    <p>
      Het doel van dit onderwijsonderzoek is om de effecten van de feedbacktools &quot;IguideME&quot;,
      &quot;LearnLoop&quot; en &quot;EtAlia&quot; op het leerproces en de effecten daarvan op de ervaren &quot;rust en
      ruimte&quot; te bestuderen.
      <br />
      De resultaten van dit onderzoek kunnen worden gebruikt om de didactische opzet van dit vak of andere vakken te
      verbeteren, en voor wetenschappelijke publicaties.
    </p>
    <h3>ONDERZOEKSBESCHRIJVING</h3>
    <p>
      De onderzoeksgroep bestaat uit een controle groep en een interventiegroep die random zal worden ingedeeld. Alleen
      de interventiegroep krijgt toegang tot de drie bovengenoemde feedbacktools. Alle studenten (zowel de controle als
      de interventiegroep) hebben toegang tot alle studiematerialen en krijgen hetzelfde onderwijs.
      <br />
      Voor het onderzoek worden persoonsgegevens (naam en student-ID) en leeractiviteitgegevens verzameld (cijfers voor
      opdrachten die wel en niet meetellen voor het eindcijfer of afgeleiden daarvan (bijv. kwaliteit van inleverde
      opdrachten of aantal ingeleverde opdrachten)).
      <br />
      Op basis van deze gegevens kun je gepersonaliseerde persoonlijke feedback ontvangen over je leerproces middels
      notaties via Canvas en/of via de feedbacktools.
      <br />
      Ook zal het effect van de feedbacktools worden onderzocht middels een korte vragenlijst die aan het begin en aan
      het eind van het vak wordt uitgezet. Voor presentatiedoeleinden worden alle gegevens geanonimiseerd.
    </p>
    <h3>VRIJWILLIGHEID</h3>
    <p>
      Deelname aan dit onderzoek is vrijwillig. In het geval dat je niet wilt deelnemen of je deelname stopzet, worden
      de door jouw gegenereerde gegevens niet gebruikt in het onderzoek. Je bent vrij om deelname aan dit onderzoek
      zonder opgave van reden stop te zetten. Je kunt dit doen door de vakcoördinator dr. Erwin van Vliet hiervan op de
      hoogte te stellen.
    </p>
    <h3>GEEN RISICO&apos;S</h3>
    <p>
      Dit onderzoek brengt geen risico’s voor je gezondheid en veiligheid met zich mee en de reguliere
      aansprakelijkheidsverzekering van de Universiteit van Amsterdam is van toepassing.
    </p>
    <h3>AANVULLENDE INFORMATIE</h3>
    <p>
      Voor vragen over dit onderzoek kun je contact opnemen met dr. Erwin van Vliet (vakcoördinator en projectleider
      Slimmer Collegejaar), e-mail e.a.vanvliet@uva.nl
    </p>
    <h2>TOESTEMMINGSFORMULIER</h2>
    <p>Hier wordt je gevraagd het toestemmingsformulier te ondertekenen.</p>
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
