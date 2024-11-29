import { Button, Col, Row } from 'antd';
import { type FC } from 'react';
import UploadEditorRow from './upload-editor_row';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useWatch, type FormInstance } from 'antd/es/form/Form';
import type { UploadManagerAddFormValues } from './upload-manager-show';
import type { User } from '@/types/user';

interface UploadEditorProps {
  form: FormInstance<UploadManagerAddFormValues>;
  students: User[];
}

const UploadEditor: FC<UploadEditorProps> = ({ form, students }) => {
  const data = useWatch('data', form) ?? [['']];
  const idColumn = useWatch('idColumn', form);

  const changeData = (value: string, rowIndex: number, colIndex: number): void => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    form.setFieldsValue({ data: newData });
  };

  const addColumn = (): void => {
    const newData = data.map((row) => [...row, '']);
    form.setFieldValue('data', newData);
  };

  const addRow = (): void => {
    const newData = [...data, Array(data[0].length).fill('')];
    form.setFieldValue('data', newData);
  };

  const removeColumn = (column: number): void => {
    const newData = data.map((row) => {
      const newRow = [...row];
      newRow.splice(column, 1);
      return newRow;
    });
    form.setFieldValue('data', newData);
  };

  const removeRow = (row: number): void => {
    const newData = data.filter((_, i) => i !== row);
    form.setFieldValue('data', newData);
  };

  const filterStudents = (): void => {
    const newData = data.filter((row: string[]) =>
      students.some((student) => student.userID.toString() === row[idColumn]),
    );
    form.setFieldValue('data', newData);
  };

  const addMissing = (): void => {
    const newData = [...data];
    students.forEach((student) => {
      for (let i = 1; i < data.length; i++) {
        if (data[i][idColumn] === student.userID.toString()) return;
      }

      const newRow: string[] = Array(data[0].length).fill('');
      newRow[idColumn] = student.userID.toString();
      newData.push(newRow);
    });

    form.setFieldValue('data', newData);
  };

  return (
    <div className='space-y-8'>
      <div className='flex gap-4'>
        <Button className='custom-default-button' onClick={addMissing}>
          Add missing students
        </Button>
        <Button className='custom-default-button' onClick={filterStudents}>
          Filter students
        </Button>
      </div>
      <div>
        <Row>
          <Col>
            {data.map((row, i) => (
              <div key={i}>
                <UploadEditorRow rowData={row} rowIndex={i} form={form} changeDataExtern={changeData} />
              </div>
            ))}
          </Col>
          <Col>
            <div className='flex'>
              <div className='flex flex-col'>
                {data.map((_, i) => (
                  <Button
                    className='!h-8'
                    icon={<MinusOutlined />}
                    key={i}
                    onClick={() => {
                      removeRow(i);
                    }}
                  />
                ))}
              </div>
              <Button
                icon={<PlusOutlined />}
                onClick={addColumn}
                style={{
                  height: `${data.length * 32}px`,
                }}
              />
            </div>
          </Col>
        </Row>
        <Row>
          {data.length > 0 && (
            <div className='flex flex-col'>
              <div className='flex'>
                {data[0].map((_, i) => (
                  <Col key={i}>
                    <Button
                      className='!w-[120px]'
                      icon={<MinusOutlined />}
                      onClick={() => {
                        removeColumn(i);
                      }}
                    />
                  </Col>
                ))}
              </div>
              <Button className='!w-full' icon={<PlusOutlined />} onClick={addRow} />
            </div>
          )}
        </Row>
      </div>
    </div>
  );
};
export default UploadEditor;
