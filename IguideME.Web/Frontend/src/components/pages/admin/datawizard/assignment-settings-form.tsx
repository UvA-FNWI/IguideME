import { patchExternalAssignment } from '@/api/entries';
import { GradingType } from '@/types/grades';
import { Assignment } from '@/types/tile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, InputNumber, Select } from 'antd';
import { FC, ReactElement } from 'react';

interface AssignmentSettingsFormProps {
  assignment: Assignment;
}

const AssignmentSettingsForm: FC<AssignmentSettingsFormProps> = ({ assignment }): ReactElement => {
  const [form] = Form.useForm();

  const queryClient = useQueryClient();
  const { mutate: updateAssignment } = useMutation({
    mutationFn: patchExternalAssignment, // TODO: Replace with actual function
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['external-assignments'] });
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
      onFinish={() => updateAssignment({ ...assignment, ...form.getFieldsValue() })}
    >
      <div className='flex w-full max-w-xs flex-wrap items-center justify-center gap-4'>
        <Form.Item
          label='Max Grade'
          name='max_grade'
          rules={[{ required: true, message: 'Please enter a max grade!' }]}
        >
          <InputNumber className='w-full max-w-[200px]' min={0} />
        </Form.Item>
        <Form.Item
          label='Grading Type'
          name='grading_type'
          rules={[{ required: true, message: 'Please enter a grading type!' }]}
        >
          <Select className='w-full max-w-[200px]'>
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
