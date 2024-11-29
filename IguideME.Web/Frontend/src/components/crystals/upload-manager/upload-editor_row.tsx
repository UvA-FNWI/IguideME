import { Col, Input, Row, type FormInstance } from 'antd';
import { type ChangeEvent, type FC } from 'react';
import type { UploadManagerAddFormValues } from './upload-manager-show';
import { useWatch } from 'antd/lib/form/Form';

interface UploadEditorRowProps {
  rowData: string[];
  rowIndex: number;
  form: FormInstance<UploadManagerAddFormValues>;
  changeDataExtern: (value: string, rowIndex: number, colIndex: number) => void;
}

const UploadEditorRow: FC<UploadEditorRowProps> = ({ rowData, rowIndex, form, changeDataExtern }) => {
  const gradeColumn = useWatch('gradeColumn', form);
  const idColumn = useWatch('idColumn', form);

  const changeData = (event: ChangeEvent<HTMLInputElement>, colIndex: number): void => {
    const value = event.target.value;
    changeDataExtern(value, rowIndex, colIndex);
  };

  const getClass = (id: number): 'id_column' | 'grade_column' | 'meta_column' => {
    switch (id) {
      case idColumn:
        return 'id_column';
      case gradeColumn:
        return 'grade_column';
      default:
        return 'meta_column';
    }
  };

  return (
    <Row>
      {rowData.map((col: any, colIndex: number) => (
        <Col key={colIndex}>
          <Input
            className={`h-8 w-[120px] ${
              getClass(colIndex) === 'id_column' ? 'bg-orange-400'
              : getClass(colIndex) === 'grade_column' ? 'bg-blue-400'
              : ''
            }`}
            value={col}
            onChange={(e) => {
              changeData(e, colIndex);
            }}
          />
        </Col>
      ))}
    </Row>
  );
};

export default UploadEditorRow;
