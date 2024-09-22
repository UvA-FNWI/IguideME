import { Col, Input, Row } from 'antd';
import type { ChangeEvent, FC } from 'react';

interface UploadEditorRowProps {
  rowData: string[];
  rowIndex: number;
  columns: { grade: number; id: number };
  changeDataExtern: (value: string, rowIndex: number, colIndex: number) => void;
}

const UploadEditorRow: FC<UploadEditorRowProps> = ({ rowData, rowIndex, columns, changeDataExtern }) => {
  const changeData = (event: ChangeEvent<HTMLInputElement>, colIndex: number): void => {
    const value = event.target.value;
    changeDataExtern(value, rowIndex, colIndex);
  };

  const getClass = (id: number): 'id_column' | 'grade_column' | 'meta_column' => {
    switch (id) {
      case columns.id:
        return 'id_column';
      case columns.grade:
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
            className={`w-[120px] ${
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
