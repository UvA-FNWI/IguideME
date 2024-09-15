import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import type { FC } from 'react';
import UploadEditorRow from './upload-editor_row';

interface UploadEditorProps {
  data: string[][];
  setData: (data: string[][]) => void;
  columns: { grade: number; id: number };
}

const UploadEditor: FC<UploadEditorProps> = ({ data, setData, columns }) => {
  const changeData = (value: string, rowIndex: number, colIndex: number): void => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const addColumn = (): void => {
    const newData = data.map((row) => [...row, '']);
    setData(newData);
  };

  const removeColumn = (column: number): void => {
    const newData = data.map((row) => {
      const newRow = [...row];
      newRow.splice(column, 1);
      return newRow;
    });
    setData(newData);
  };

  return (
    <div>
      <Row>
        <Col>
          {data.map((row, i) => (
            <div key={i}>
              <UploadEditorRow rowData={row} rowIndex={i} columns={columns} changeDataExtern={changeData} />
            </div>
          ))}
        </Col>
        <Col>
          <Button className='h-full' icon={<PlusOutlined />} onClick={addColumn}></Button>
        </Col>
      </Row>
      <Row>
        {data[0].map((_, i) => (
          <Col key={i}>
            <Button
              className='w-[120px]'
              icon={<MinusOutlined />}
              onClick={() => {
                removeColumn(i);
              }}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};
export default UploadEditor;
