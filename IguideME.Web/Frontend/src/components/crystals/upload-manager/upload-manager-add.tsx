import { EditOutlined, QuestionCircleOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { App, Form, InputNumber, Tabs, Tooltip, type FormInstance } from 'antd';
import { type FC } from 'react';
import CSVReader from 'react-csv-reader';
import UploadEditor from './upload-editor';
import type { UploadManagerAddFormValues, UploadManagerProps } from './upload-manager-show';

export interface UploadManagerAddProps extends UploadManagerProps {
  form: FormInstance<UploadManagerAddFormValues>;
}

const UploadManagerAdd: FC<UploadManagerAddProps> = ({ form, students }) => {
  const validator = async (_: any, value: string[][]): Promise<undefined> => {
    // Case 1: No rows
    if (value.length === 0) {
      await Promise.reject(new Error('No rows present'));
      return;
    }

    // Case 2: No columns
    if (value[0].length === 0) {
      await Promise.reject(new Error('No columns present'));
      return;
    }

    // Case 3: Not every student has a grade
    const idColumn = form.getFieldValue('idColumn');
    const gradeColumn = form.getFieldValue('gradeColumn');

    const allStudents = students.map((student) => student.userID);
    const seenStudents = new Set<string>();

    for (let i = 0; i < value.length; i++) {
      if (value[i].length === 0 || !value[i][idColumn] || !value[i][gradeColumn]) {
        continue;
      }

      seenStudents.add(value[i][idColumn]);
    }

    if (allStudents.some((student) => !seenStudents.has(student))) {
      await Promise.reject(new Error('Not every student has a grade'));
      return;
    }

    await Promise.resolve();
  };

  const { notification } = App.useApp();

  return (
    <div className='flex w-full flex-col gap-12'>
      <div className='flex flex-col gap-4'>
        <h4 className='text-lg'>Parameters</h4>
        <div className='flex gap-8'>
          <div className='flex-1 flex-grow space-y-2'>
            <div className='flex gap-2'>
              <h5 className='text-base text-text'>ID column</h5>
              <Tooltip
                title={
                  <p className='text-xs text-white'>
                    This indicates the column containing the student id&apos;s. In case of manual addition, will the
                    student id column be highlighted in <em className='text-orange-500'>orange</em> bellow.
                  </p>
                }
              >
                <QuestionCircleOutlined className='text-text' />
              </Tooltip>
            </div>
            <Form.Item
              name='idColumn'
              rules={[
                { required: true, message: "Please select the column containing the student id's" },
                {
                  type: 'number',
                  message: 'Please enter a valid number',
                },
              ]}
            >
              <InputNumber
                className='min-w-[120px] !border border-solid !border-accent/70 !bg-surface1 hover:!border-accent hover:!bg-surface2 [&_input]:!text-text'
                min={0}
                step={1}
              />
            </Form.Item>
          </div>
          <div className='flex-1 flex-grow space-y-2'>
            <div className='flex gap-2'>
              <h5 className='text-base text-text'>Grade column</h5>
              <Tooltip
                title={
                  <p className='text-xs text-white'>
                    This indicates the column containing the grades. In case of manual addition, will the grade column
                    which will be highlighted in <em className='text-blue-500'>blue</em> bellow.
                  </p>
                }
              >
                <QuestionCircleOutlined className='text-text' />
              </Tooltip>
            </div>
            <Form.Item
              name='gradeColumn'
              rules={[
                { required: true, message: "Please select the column containing the grades's" },
                {
                  type: 'number',
                  message: 'Please enter a valid number',
                },
              ]}
            >
              <InputNumber
                className='min-w-[120px] !border border-solid !border-accent/70 !bg-surface1 hover:!border-accent hover:!bg-surface2 [&_input]:!text-text'
                min={0}
                step={1}
              />
            </Form.Item>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <h4 className='text-lg'>Data</h4>
        <Tabs
          className='course-selection-tabs flex-1 flex-grow'
          defaultActiveKey='0'
          items={[
            {
              key: '0',
              label: 'Upload File',
              icon: <VerticalAlignBottomOutlined className='text-text' />,
              children: (
                <Form.Item
                  name='data'
                  rules={[
                    {
                      required: true,
                      message: 'Please upload a CSV file or enter the data manually',
                    },
                    {
                      message:
                        "The data is not valid. It either doesn't contain any rows, the headers are missing or not every student has an assigned grade.",
                      validator,
                    },
                  ]}
                >
                  <div className='space-y-2'>
                    <p>
                      Upload a CSV file with the student data. The first row should contain the headers, and the columns
                      should be in the same order as the parameter data.
                    </p>
                    <CSVReader
                      onFileLoaded={(data: string[][]) => {
                        form.setFieldsValue({ data });
                      }}
                      onError={(error) => {
                        notification.error({ message: 'Error uploading data', description: error.message });
                      }}
                      parserOptions={{
                        header: false,
                        dynamicTyping: false,
                        skipEmptyLines: true,
                        transformHeader: (header: any) => header.toLowerCase().replace(/\W/g, '_'),
                      }}
                    />
                  </div>
                </Form.Item>
              ),
            },
            {
              key: '1',
              label: 'Manual Entry',
              icon: <EditOutlined className='text-text' />,
              children: (
                <Form.Item
                  name='data'
                  rules={[
                    {
                      required: true,
                      message: 'Please upload a CSV file or enter the data manually',
                    },
                    {
                      message:
                        "The data is not valid. It either doesn't contain any rows, the headers are missing or not every student has an assigned grade.",
                      validator,
                    },
                  ]}
                >
                  <UploadEditor form={form} students={students} />
                </Form.Item>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};
export default UploadManagerAdd;
