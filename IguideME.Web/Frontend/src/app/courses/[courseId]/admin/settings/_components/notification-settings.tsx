'use client';

import { type FC, memo, type ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { type DateObject } from 'react-multi-date-picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Checkbox, DatePicker, Divider, Form, Segmented } from 'antd';
import { type CheckboxChangeEvent } from 'antd/es/checkbox';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { toast } from 'sonner';

import { getNotificationSettings, postNotificationSettings } from '@/api/course-setting';

import { QueryError } from './query-error';
import { QueryLoading } from './query-loading';

interface NotificationAdminSettings {
  isRange: boolean;
  selectedDays: string | null;
  selectedDates: string | null;
}

function NotificationSettings(): ReactElement {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: getNotificationSettings,
  });

  const { range, selectedDays, selectedDates } = useMemo(() => {
    if (data) {
      const range = data.isRange;
      const selectedDays = data.selectedDays ? data.selectedDays.split(', ') : null;
      const selectedDates = data.selectedDates ? data.selectedDates.split(', ').map((date) => dayjs(date)) : [];

      return { range, selectedDays, selectedDates };
    }
    return { range: false, selectedDays: null, selectedDates: [] };
  }, [data]);

  if (isError || isLoading || data === undefined) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div className='bg-surface1 h-20'>
          {isError ?
            <QueryError className='top-[-30px]' title='Failed to load notification settings' />
          : null}
        </div>
      </QueryLoading>
    );
  }

  return (
    <NotificationSettingsForm isRange={range ?? false} selectedDays={selectedDays} selectedDates={selectedDates} />
  );
}

interface Data {
  selectedDates: DateObject[] | [DateObject, DateObject];
}

const NotificationSettingsForm: FC<{
  isRange: boolean;
  selectedDays: string[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- If you change the type of selectedDates to the correct type (DayJS[]), the form will not work
  selectedDates: any;
}> = memo(({ isRange, selectedDays, selectedDates }): ReactElement => {
  const [form] = useForm<Data>();
  const [range, setRange] = useState<boolean>(isRange);

  const [checkedList, setCheckedList] = useState<string[]>(selectedDays ?? ['Tue', 'Thu']);

  const rangeChangeHandler = useCallback(() => {
    form.resetFields();
    setRange((prev) => !prev);
  }, [form]);

  const queryClient = useQueryClient();
  const { mutate, status } = useMutation({
    mutationFn: postNotificationSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
  });

  useEffect(() => {
    if (status === 'success') {
      toast.success('Notification settings saved successfully', {
        closeButton: true,
      });
    } else if (status === 'error') {
      toast.error('Failed to save notification settings', {
        closeButton: true,
      });
    }
  }, [status]);

  const submit = useCallback(
    (data: Data): void => {
      const notificationSettingsData = {
        isRange: range,
        selectedDays: checkedList.length === 0 ? null : checkedList.map((day) => day.toString()).join(', '),
        selectedDates: data.selectedDates.map((date) => date.format('YYYY-MM-DD')).join(', '),
      };

      mutate(notificationSettingsData);
    },
    [checkedList, range, mutate],
  );

  return (
    <Form<Data>
      className='flex flex-col gap-2'
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- If you change the type of selectedDates to the correct type (DayJS[]), the form will not work
      initialValues={{ selectedDates }}
      form={form}
      name='notification_settings_form'
      onFinish={submit}
    >
      <p className='mb-2 text-sm'>
        Select the dates or the range of dates that the students will receive notifications.
      </p>
      <Segmented
        className='custom-segmented !bg-surface2 w-fit'
        options={[
          { label: 'Select Dates', value: false },
          { label: 'Select Range', value: true },
        ]}
        value={range}
        onChange={rangeChangeHandler}
      />
      <div className='custom-datepicker'>
        <DatePickers isRange={range} checkedList={checkedList} setCheckedList={setCheckedList} />
      </div>
      <div className='flex justify-end'>
        <Button className='custom-default-button right-0 min-w-20' htmlType='submit'>
          Save
        </Button>
      </div>
    </Form>
  );
});
NotificationSettingsForm.displayName = 'NotificationSettingsForm';

interface DatePickersProps {
  isRange: boolean;
  checkedList: string[];
  setCheckedList: (list: string[]) => void;
}

function DatePickers({ isRange, checkedList, setCheckedList }: DatePickersProps): ReactElement {
  const checkBoxOptions = useMemo(() => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], []);
  const [error, setError] = useState<string | null>(null);

  const onGroupChange = useCallback((list: string[]) => {
    setCheckedList(list);

    if (list.length === 0) {
      setError('Please select at least one day');
    } else {
      setError(null);
    }
  }, []);

  const onCheckAllChange = useCallback(
    (e: CheckboxChangeEvent) => {
      setCheckedList(e.target.checked ? checkBoxOptions : []);
    },
    [checkBoxOptions, setCheckedList],
  );

  const Range = (
    <>
      <Form.Item
        className='m-0'
        name='selectedDates'
        rules={[{ required: true, message: 'Please select a date range' }]}
      >
        <DatePicker.RangePicker
          className='[&_input]:!text-text w-full !max-w-72'
          disabledDate={(current) => current.toDate() < new Date()}
          format='YYYY-MM-DD'
          picker='week'
        />
      </Form.Item>
      <p className='mt-4 text-sm'>On which days of the week do you want to send notifications?</p>
      <div className='flex h-14 align-top'>
        <Checkbox
          className='text-text h-fit'
          indeterminate={checkedList.length > 0 && checkedList.length < checkBoxOptions.length}
          onChange={onCheckAllChange}
          checked={checkBoxOptions.length === checkedList.length}
        >
          Check all
        </Checkbox>
        <Divider type='vertical' className='h-6' />
        <Form.Item className='m-0 [&_div]:!min-h-0' validateStatus={error ? 'error' : ''} help={error}>
          <Checkbox.Group
            className='[&_span]:!text-text'
            options={checkBoxOptions}
            value={checkedList}
            onChange={onGroupChange}
          />
        </Form.Item>
      </div>
    </>
  );

  const Single = (
    <Form.Item className='m-0' name='selectedDates' rules={[{ required: true, message: 'Please select a date' }]}>
      <DatePicker
        className='!w-full !max-w-72'
        disabledDate={(current) => current.toDate() < new Date()}
        format='YYYY-MM-DD'
        multiple
        maxTagCount='responsive'
        placeholder='Select (multiple) dates'
      />
    </Form.Item>
  );

  return isRange ? Range : Single;
}

export type { NotificationAdminSettings };
export { NotificationSettings };
