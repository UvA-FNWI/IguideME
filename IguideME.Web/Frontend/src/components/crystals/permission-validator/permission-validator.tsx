import { getStudentAcceptStatus, postConsentSettings } from '@/api/student_settings';
import { getSelf } from '@/api/users';
import { ConsentText } from '@/components/pages/student-settings/student-settings';
import { UserRoles } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Collapse, Row } from 'antd';
import { useEffect, type FC, type ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { toast } from 'sonner';
import { Loading as LoadingDots } from 'react-loading-dot';

const IguideMELoading: FC = () => {
  return (
    <div className='h-screen'>
      <div className='relative pt-[40vh] text-center'>
        <h1 className='text-[4vmax]'>IguideME</h1>
        <LoadingDots size={'10px'} margin={'10px'} background={'black'} />
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

  if (!self.settings?.consent) {
    return (
      <div className='mx-auto max-w-3xl p-5'>
        <h1 className='text-xl font-bold tracking-tight'>Informed Consent</h1>
        <Collapse
          bordered={false}
          className='[&>div>div]:!p-0 [&_svg]:!text-text'
          ghost
          items={[
            {
              key: 1,
              label: (
                <>
                  <p className='text-justify text-text'>
                    IguideME requires your informed consent to process and use your data in compliance with the General
                    Data Protection Regulation (GDPR). Without your consent, the app cannot function. Please review and
                    provide your consent to proceed. For more details, <span className='underline'>click here</span>. If
                    you do not want to provide your consent, you can safely close the app.
                  </p>
                </>
              ),
              children: <ConsentText />,
              showArrow: true,
            },
          ]}
        />

        <Row justify={'center'}>
          <Button
            className='custom-default-button'
            onClick={() => {
              saveConsent(true);
            }}
          >
            Accept
          </Button>
        </Row>
      </div>
    );
  }

  return <Outlet />;
};
export default PermissionValidator;
