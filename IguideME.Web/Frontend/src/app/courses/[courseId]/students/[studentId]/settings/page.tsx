'use client';

import { type ReactElement, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import { useMutation } from '@tanstack/react-query';
import { CircleAlert } from 'lucide-react';
import { boolean, type InferOutput, maxValue, minValue, number, object, pipe } from 'valibot';
import { useShallow } from 'zustand/react/shallow';

import { postConsentSettings, postGoalGrade, postNotificationSettings } from '@/api/student-setting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useActionStatus } from '@/hooks/use-action-status';
import { useWarnIfUnsavedChanges } from '@/hooks/use-warn-if-unsaved-changes';
import { useGlobalContext } from '@/stores/global-store/use-global-store';

const EditSettingsSchema = object({
  notifications: boolean('Please specify whether you want to receive notifications.'),
  goalGrade: pipe(
    number('Please enter a valid number for your goal grade.'),
    minValue(1, 'The goal grade must be at least 1.'),
    maxValue(10, 'The goal grade must be at most 10.'),
  ),
  consent: boolean('Please specify whether you consent to the use of your data.'),
});

export default function Settings(): ReactElement {
  const { self } = useGlobalContext(useShallow((state) => ({ self: state.self })));

  const form = useForm<InferOutput<typeof EditSettingsSchema>>({
    resolver: valibotResolver(EditSettingsSchema),
    defaultValues: {
      notifications: self.settings?.notifications ?? false,
      goalGrade: self.settings?.goal_grade ?? 1,
      consent: self.settings?.consent ?? false,
    },
  });

  const {
    mutate: saveNotifications,
    status: notificationsStatus,
    isPending: isPendingNotifications,
  } = useMutation({
    mutationFn: postNotificationSettings,
  });

  const {
    mutate: saveGoalGrade,
    status: goalGradeStatus,
    isPending: isPendingGoalGrade,
  } = useMutation({
    mutationFn: postGoalGrade,
  });

  const {
    mutate: saveConsent,
    status: consentStatus,
    isPending: isPendingConsent,
  } = useMutation({
    mutationFn: postConsentSettings,
  });

  const description = useMemo(
    () => ({
      error: 'Failed to save your settings.',
      success: 'Successfully saved your settings.',
    }),
    [],
  );

  useActionStatus({
    description,
    status:
      notificationsStatus !== 'idle' ? notificationsStatus
      : goalGradeStatus !== 'idle' ? goalGradeStatus
      : consentStatus,
  });

  function onSubmit(data: InferOutput<typeof EditSettingsSchema>): void {
    if (data.notifications !== self.settings?.notifications) {
      saveNotifications(data.notifications);
    }

    if (data.goalGrade !== self.settings?.goal_grade) {
      saveGoalGrade(data.goalGrade);
    }

    if (data.consent !== self.settings?.consent) {
      saveConsent(data.consent);
    }
  }

  useWarnIfUnsavedChanges(form.formState.isDirty);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Settings</CardTitle>
        <CardDescription>
          Manage your settings to personalize your experience. You can enable email notifications, set your goal grade,
          and review the informed consent document. Make sure to save your changes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
            <Card className='max-w-5xl'>
              <CardHeader>
                <CardTitle className='text-xl'>Notifications</CardTitle>
                <CardDescription>
                  When enabled, you will receive email notifications about the latest updates on your academic process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='notifications'
                  render={({ field }) => (
                    <FormItem className='justify-left flex items-center gap-4'>
                      <FormLabel className='w-40'>Enable notifications</FormLabel>
                      <FormControl>
                        <Checkbox checked={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className='max-w-5xl'>
              <CardHeader>
                <CardTitle className='flex gap-2'>
                  <span className='text-xl'>Goal Grade</span>
                  {!self.settings?.goal_grade && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <CircleAlert className='stroke-warning' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className='text-sm font-normal'>You have not set a goal grade yet.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </CardTitle>
                <CardDescription>
                  Specify the grade you aim to achieve for this course. You can update your goal at any time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name='goalGrade'
                  render={({ field }) => (
                    <FormItem className='max-w-80'>
                      <FormLabel>Goal grade</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type='number'
                          min={1}
                          max={10}
                          step={1}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className='max-w-5xl'>
              <CardHeader>
                <CardTitle className='text-xl'>Informed Consent</CardTitle>
                <CardDescription className='text-justify'>
                  Review the informed consent document carefully. Your data will only be processed if you accept the
                  terms. You can change your consent preference at any time.
                </CardDescription>
              </CardHeader>
              <CardContent className='!py-0'>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className='!m-0 !p-0' variant='link'>
                      Click here to read the informed consent document.
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='flex max-h-[75%] min-w-[50%] flex-col'>
                    <ScrollArea className='flex-grow overflow-y-auto'>
                      <div className='prose min-w-[100%]'>
                        <h1>IguideME</h1>
                        <h2>INFORMED CONSENT</h2>
                        <p>
                          Dear participant,
                          <br />
                          We ask for your cooperation in an evaluation study into educational improvement. In this
                          document, the so-called &quot;informed consent&quot;, we explain this study and you can
                          indicate whether you want to cooperate. Read the text below carefully.
                        </p>
                        <h3>Goal of the research</h3>
                        <p>
                          The goal of this educational research is to study the effects of the feedback tool “IguideME”
                          and activating learning tools (e.g. Perusall) on the learning process.
                          <br />
                          The results of this research can be used to facilitate your learning process, to improve the
                          design of this and other courses, and for scientific publications.
                        </p>
                        <h3>Research description</h3>
                        <p>
                          To investigate the effects of using IguideME, personal data (name and student ID) and learning
                          activity data will be collected. Based on these data, you will receive personal feedback via
                          the IguideME dashboard in Canvas. You will also receive a predicted course grade that will be
                          automatically calculated from the learning activity data using an algorithm. To investigate
                          the effects of activating learning tools, the quality of assignments will be assessed and the
                          results of a short questionnaire that scores motivation and learning behavior will be compared
                          between the beginning and at the end of the course. For presentations purposes, all data will
                          be anonymized.
                        </p>
                        <h3>Voluntariness</h3>
                        <p>
                          The participation in this research is voluntary. In the case that you decline to participate
                          or stop your participation the data that you have generated will not be used in the research.
                          You are free to stop your participation in this research without specifying a reason by
                          informing dr. Erwin van Vliet.
                        </p>
                        <h3>Insurance</h3>
                        <p>
                          This research brings no risks for your health and safety and in this case the regular
                          liability insurance of the University of Amsterdam is valid.
                        </p>
                        <h3>Additional Information</h3>
                        <p>
                          In case of any questions about this research please contact: <b>TEACHER NAME</b> (<b>ROLE</b>
                          ), phone <b>PHONE-NUMBER</b>, e-mail <b>EMAIL@DOMAIN.XYZ</b>
                        </p>
                        <h2>CONSENT FORM</h2>
                        <p>Here you will be asked to sign the Informed consent.</p>
                        <ul>
                          <li className='text-text'>
                            By choosing <i>&quot;Yes&quot;</i> in this form, you declare that you have read the document
                            entitled “informed consent IguideME”, understood it, and confirm that you agree with the
                            procedure as described.
                            <br />
                          </li>
                          <li className='text-text'>
                            By choosing <i>&quot;No&quot;</i> in the form, you declare that you have read the document
                            entitled “informed consent IguideME”, understood it, and confirm that you do not want to
                            participate in this study.
                          </li>
                        </ul>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </CardContent>
              <CardFooter>
                <FormField
                  control={form.control}
                  name='consent'
                  render={({ field }) => (
                    <FormItem className='justify-left flex max-w-96 items-center gap-4'>
                      <FormLabel>I have read and understood the informed consent</FormLabel>
                      <FormControl>
                        <Checkbox checked={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardFooter>
            </Card>

            <Button
              className='w-20'
              disabled={isPendingNotifications || isPendingGoalGrade || isPendingConsent}
              type='submit'
            >
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
