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
        <h1 className='text-2xl font-bold tracking-tight'>Informed Consent</h1>
        <p className='mt-4'>
          Welcome to IguideME! Before you can access the application, we need your informed consent. IguideME is a
          personalized feedback tool designed to enhance your learning experience by providing insights into your
          learning process and outcomes. By consenting, you agree to the collection and use of your data as described in
          the consent form below. If you choose not to consent, you will not be able to use IguideME.
        </p>
        <p className='text-xs text-text'></p>
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
                    Click <u>here</u> to show the content of the Informed consent.
                  </p>
                </>
              ),
              children: <ConsentText />,
              showArrow: true,
            },
          ]}
        />
        <ul className='list-inside list-disc'>
          <li>
            By choosing "Yes" in this form, I declare that I have read the document entitled “informed consent
            IguideME”, understood it, and consent to my personal data being processed for the purposes stated in the
            consent form.
          </li>
          <li>
            By choosing "No" in the form, I declare that I have read the document entitled “informed consent IguideME”,
            understood it, and do not consent to my personal data being processed for the purposes stated in the consent
            form.
          </li>
        </ul>

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
