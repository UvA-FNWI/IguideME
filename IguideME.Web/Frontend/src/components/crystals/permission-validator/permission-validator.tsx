import { postConsentSettings } from '@/api/student_settings';
import { getSelf } from '@/api/users';
import { ConsentText, GoalGrade } from '@/components/pages/student-settings/student-settings';
import { ConsentEnum, UserRoles } from '@/types/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Collapse } from 'antd';
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

  // const {
  //   data: accepted,
  //   isError: acceptedError,
  //   isLoading: acceptedLoading,
  // } = useQuery({
  //   queryKey: ['accepted', self?.userID],
  //   queryFn: async () => await getStudentAcceptStatus(self ? self.userID : ''),
  // });

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
        <p className='text-xs text-text'></p>
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
                Here you will be asked to sign the Informed consent. Click <u>here</u> to show the content of the Informed consent.
                </p>
              </>
            ),
            children: <ConsentText />,
            showArrow: true,
          },
        ]}
      />
        <ul className='list-disc list-inside'>
          <li>By choosing "Yes" in this form, I declare that I have read the document entitled “informed consent IguideME”,
          understood it, and consent to my personal data being processed for the purposes stated above.</li>
          <li>By choosing "No" in the form, I declare that I have read the document entitled “informed consent IguideME”,
          understood it, and do not consent to my personal data being processed for the purposes stated above.</li>
        </ul>
        <ConsentText />

        <div className='flex w-full items-center justify-center gap-4'>
          <Button
            className='custom-default-button'
            onClick={() => {
              saveConsent(2);
            }}
          >
            No
          </Button>
          <Button
            className='custom-default-button'
            onClick={() => {
              saveConsent(1);
            }}
          >
            Yes
          </Button>
        </div>
      </div>
    );
  }

  // if (acceptedLoading) {
  //   return <IguideMELoading />;
  // } else if (acceptedError || accepted === undefined) {
  //   return <h1 className='text-lg'>Your account has not yet been processed, try again tomorrow!</h1>;
  // }

  // if (!accepted) {
  //   return (
  //     <div className='mx-auto max-w-3xl p-5'>
  //       <h1 className='text-xl font-bold tracking-tight'>No access</h1>
  //       <p>You do not have access to this application. If you think this is an error, please contact the teacher.</p>
  //     </div>
  //   );
  // }

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
