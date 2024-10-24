import { getStudentAcceptStatus, postConsentSettings } from '@/api/student_settings';
import { getSelf } from '@/api/users';
import { ConsentText, GoalGrade } from '@/components/pages/student-settings/student-settings';
import { ConsentEnum, UserRoles } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import { useEffect, type FC, type ReactElement } from 'react';
import { Loading as LoadingDots } from 'react-loading-dot';
import { Outlet } from 'react-router-dom';
import { toast } from 'sonner';

const IguideMELoading: FC = () => {
  return (
    <div className='h-screen'>
      <div className='relative pt-[40vh] text-center'>
        <h1 className='text-[4vmax]'>IguideME</h1>
        <LoadingDots size='10px' margin='10px' background='black' />
      </div>
    </div>
  );
};

const PermissionValidator: FC = (): ReactElement => {
  const {
    data: self,
    isError: selfError,
    isLoading: selfLoading,
  } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,
  });

  const {
    data: accepted,
    isError: acceptedError,
    isLoading: acceptedLoading,
  } = useQuery({
    queryKey: ['accepted', self?.userID],
    queryFn: async () => await getStudentAcceptStatus(self ? self.userID : ''),
  });

  const queryClient = useQueryClient();
  const { mutate: saveConsent, status } = useMutation({
    mutationFn: postConsentSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['self'] });
    },
  });

  useEffect(() => {
    if (status === 'error') {
      toast.error('Failed to save consent settings');
    }
  }, [status]);

  if (selfLoading) {
    return <IguideMELoading />;
  } else if (selfError || !self) {
    return <h1 className='text-lg'>Your account has not yet been processed, try again tomorrow!</h1>;
  }

  if (self.role === UserRoles.instructor) return <Outlet />;

  if (self.settings?.consent !== ConsentEnum.Accepted) {
    return (
      <div className='mx-auto max-w-3xl space-y-5 p-5'>
        <h1 className='text-xl font-bold tracking-tight'>Informed Consent</h1>
        <ConsentText />
        <p className='text-text text-justify'>
          &quot;Ik verklaar dat ik de informatie heb gelezen en begrepen. Ik geef toestemming voor deelname aan dit
          onderwijsonderzoek en het gebruik van mijn gegevens daarin. Ik behoud mijn recht om deze toestemming stop te
          zetten zonder een expliciete reden op te geven en om mijn deelname aan dit experiment op elk moment stop te
          zetten.&quot;
        </p>

        <div className='flex w-full items-center justify-center gap-4'>
          <Button
            className='custom-default-button'
            onClick={() => {
              saveConsent(2);
            }}
          >
            Deny
          </Button>
          <Button
            className='custom-default-button'
            onClick={() => {
              saveConsent(1);
            }}
          >
            Accept
          </Button>
        </div>
      </div>
    );
  }

  if (acceptedLoading) {
    return <IguideMELoading />;
  } else if (acceptedError || accepted === undefined) {
    return <h1 className='text-lg'>Your account has not yet been processed, try again tomorrow!</h1>;
  }

  if (!accepted) {
    return (
      <div className='mx-auto max-w-3xl p-5'>
        <h1 className='text-xl font-bold tracking-tight'>No access</h1>
        <p>You do not have access to this application. If you think this is an error, please contact the teacher.</p>
      </div>
    );
  }

  if (self.settings.goal_grade <= 0) {
    return (
      <div className='flex flex-col items-center justify-center'>
        <GoalGrade goalGrade={self.settings.goal_grade} user={self} />
      </div>
    );
  }

  return <Outlet />;
};
export default PermissionValidator;
