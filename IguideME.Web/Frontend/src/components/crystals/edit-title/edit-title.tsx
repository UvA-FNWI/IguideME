import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useState, type FC } from 'react';

interface EditTitleProps {
  title: string;
  onSave: (title: string) => void;
}

const EditTitle: FC<EditTitleProps> = ({ title, onSave }) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleSave = (values: { title: string }): void => {
    onSave(values.title);
    setEditing(false);
  };

  return editing ?
      <Form
        form={form}
        initialValues={{ title }}
        onFinish={handleSave}
        className='flex flex-wrap gap-4'
        onBlur={() => {
          setEditing(false);
        }}
      >
        <Form.Item name='title' rules={[{ required: true, message: 'Title is required' }]}>
          <Input
            className='w-full border-accent bg-surface1 text-text hover:border-accent/50 hover:bg-surface1 focus:border-accent focus:bg-surface1 focus:shadow-sm focus:shadow-accent aria-invalid:!border-failure aria-invalid:shadow-none aria-invalid:focus:!shadow-sm aria-invalid:focus:!shadow-failure'
            autoFocus
          />
        </Form.Item>
        <Form.Item>
          <Button
            icon={<SaveOutlined />}
            iconPosition='end'
            type='primary'
            htmlType='submit'
            onMouseDown={(event) => event.preventDefault()}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    : <Button
        className='custom-default-button border-none'
        icon={<EditOutlined />}
        iconPosition='end'
        onClick={() => {
          setEditing(true);
        }}
      >
        <h3 className='text-base font-bold text-text'>{title}</h3>
      </Button>;
};

export default EditTitle;
