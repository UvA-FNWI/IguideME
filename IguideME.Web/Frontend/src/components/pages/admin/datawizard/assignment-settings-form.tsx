import { patchExternalAssignment } from '@/api/entries';
import { GradingType } from '@/types/grades';
import { type Assignment } from '@/types/tile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App, Button, Form, InputNumber, Select } from 'antd';
import { type FC, type ReactElement } from 'react';

interface AssignmentSettingsFormProps {
  assignment: Assignment;
}

const AssignmentSettingsForm: FC<AssignmentSettingsFormProps> = ({ assignment }): ReactElement => {
  const [form] = Form.useForm();

  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { mutate: updateAssignment } = useMutation({
    mutationFn: patchExternalAssignment, // TODO: Replace with actual function

    onMutate: () => {
      void message.open({
        key: 'external-assignment',
        type: 'loading',
        content: 'Saving external assignment...',
      });
    },

    onError: () => {
      void message.open({
        key: 'external-assignment',
        type: 'error',
        content: 'Error saving external assignment',
        duration: 3,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['external-assignments'] });

      void message.open({
        key: 'external-assignment',
        type: 'success',
        content: 'External assignment saved successfully',
        duration: 3,
      });
    },
  });

  return (
    <Form
      form={form}
      layout='vertical'
      initialValues={{
        max_grade: assignment.max_grade,
        grading_type: assignment.grading_type,
      }}
      onFinish={() => {
        const updatedAssignment: Assignment = { ...assignment, ...form.getFieldsValue() };
        updateAssignment(updatedAssignment);
      }}
    >
      <div className='flex flex-wrap items-center justify-center gap-4 md:justify-start'>
        <Form.Item
          className='[&_label]:!text-text'
          label='Max Grade'
          name='max_grade'
          rules={[{ required: true, message: 'Please enter a max grade!' }]}
        >
          <InputNumber
            className='antNumberInput w-full max-w-[200px] !border border-solid !border-accent/60 !bg-surface1 hover:!border-accent hover:!bg-surface2 [&_input]:!text-text'
            min={0}
          />
        </Form.Item>
        <Form.Item
          className='[&_label]:!text-text'
          label='Grading Type'
          name='grading_type'
          rules={[{ required: true, message: 'Please enter a grading type!' }]}
        >
          <Select
            className='w-full max-w-[200px] [&>div]:!border-accent/70 [&>div]:!bg-surface1 [&>div]:!shadow-none [&>div]:hover:!border-accent [&>div]:hover:!bg-surface2 [&_span]:!text-text'
            dropdownClassName='bg-surface1 [&_div]:!text-text selectionSelected'
          >
            {Object.keys(GradingType)
              .filter((key) => isNaN(Number(key)))
              .map((key) => (
                <Select.Option key={key} value={GradingType[key as keyof typeof GradingType]}>
                  {key}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </div>
      <Button className='custom-default-button' htmlType='submit'>
        Save
      </Button>
    </Form>
  );
};

export default AssignmentSettingsForm;
