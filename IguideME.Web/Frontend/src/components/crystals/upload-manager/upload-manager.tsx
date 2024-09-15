import type { User } from '@/types/user';
import { DownOutlined, QuestionCircleOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Col, Input, InputNumber, Row, Tooltip } from 'antd';
import { useState, type ChangeEvent, type FC } from 'react';
import UploadEditor from './upload-editor';
import CSVReader, { type IFileInfo } from 'react-csv-reader';
import type { Tile } from '@/types/tile';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadData } from '@/api/tiles';

interface UploadManagerProps {
  tile: Tile;
  closeUploadMenu: () => any;
  students: User[];
}

const UploadManager: FC<UploadManagerProps> = ({ tile, closeUploadMenu, students }) => {
  const [data, setData] = useState<string[][]>([]);
  const [title, setTitle] = useState<string>('');
  const [idColumn, setIdColumn] = useState<number>(0);
  const [gradeColumn, setGradeColumn] = useState<number>(0);
  const [editorCollapsed, setEditorCollapsed] = useState<boolean>(true);

  const handleCSVUpload = (data: string[][], title: string): void => {
    if (title.length < 1) setTitle(title);
    setData(data);
  };

  const filterStudents = (): string[][] => {
    const headers = data[0];
    const d = data.filter((row: string[]) => students.some((student) => student.userID.toString() === row[idColumn]));

    return [headers, ...d];
  };

  const addMissing = (): void => {
    students.forEach((student) => {
      for (let i = 1; i < data.length; i++) {
        if (data[i][idColumn] === student.userID.toString()) return;
      }

      const newRow: string[] = Array(data[0].length).fill('');
      newRow[idColumn] = student.userID.toString();
      data.push(newRow);
    });

    setData(data);
  };

  const changeTitle = (event: ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  };

  const changeIDColumn = (nr: number | null): void => {
    setIdColumn(nr ?? 0);
  };

  const changeGradeColumn = (nr: number | null): void => {
    setGradeColumn(nr ?? 0);
  };

  const validate = (data: string[][]): boolean => {
    return title.length > 0 && data.length > 1;
  };

  const queryClient = useQueryClient();
  const { mutate: upload, isPending } = useMutation({
    mutationFn: uploadData,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tile-groups'] });
    },
  });

  return (
    <div id='uploadManager'>
      <Row className='mb-2' gutter={[10, 10]}>
        <Col className='flex flex-col justify-between'>
          <div className='flex flex-row items-center gap-1'>
            <label>Data Source</label>
            <Tooltip
              title={
                <span className='text-text'>
                  You can upload a CSV column containing at least a column with student id&apos;s and a column with
                  their grades. Any remaining columns will be saved as metadata.
                </span>
              }
              color='rgb(255, 255, 255)'
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
          <label
            className='custom-default-button flex h-8 items-center justify-center rounded-md border px-[15px] py-1 hover:cursor-pointer'
            role='button'
            tabIndex={0}
          >
            Upload CSV
            <CSVReader
              onFileLoaded={(data: string[][], fileInfo: IFileInfo) => {
                handleCSVUpload(data, fileInfo.name);
              }}
              inputStyle={{ display: 'none' }}
              onError={() => {
                alert('error');
              }}
              parserOptions={{
                header: false,
                dynamicTyping: false,
                skipEmptyLines: true,
                transformHeader: (header: any) => header.toLowerCase().replace(/\W/g, '_'),
              }}
            />
          </label>
        </Col>
        <Col className='flex flex-col justify-between'>
          <div className='flex flex-row items-center gap-1'>
            <label>Entry title</label>
            <Tooltip
              title={
                <span className='text-text'>
                  Upon upload, the data will be saved as a tile entry, similarly to canvas assignments.
                </span>
              }
              color='rgb(255, 255, 255)'
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
          <Input
            className='w-full border-accent/50 bg-surface1 text-text hover:border-accent hover:bg-surface2 focus:border-accent focus:shadow-sm focus:shadow-accent aria-invalid:!border-failure aria-invalid:shadow-none aria-invalid:focus:!shadow-sm aria-invalid:focus:!shadow-failure'
            placeholder='Title'
            value={title}
            onChange={changeTitle}
          />
        </Col>
        <Col className='flex flex-col justify-between'>
          <div className='flex flex-row items-center gap-1'>
            <label>ID column</label>
            <Tooltip
              title={
                <span className='text-text'>
                  This indicates the column containing the student id&apos;s, which will be highlighted in{' '}
                  <em style={{ color: 'rgb(255, 130, 0)' }}>orange</em> bellow.
                </span>
              }
              color='rgb(255, 255, 255)'
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
          <InputNumber
            className='w-[120px] !border border-solid !border-accent/70 !bg-surface1 hover:!border-accent hover:!bg-surface2 [&_input]:!text-text'
            min={0}
            value={idColumn}
            onChange={changeIDColumn}
          />
        </Col>
        <Col className='flex flex-col justify-between'>
          <div className='flex flex-row items-center gap-1'>
            <label>Grade column</label>
            <Tooltip
              title={
                <span className='text-text'>
                  This indicates the column containing the grades, which will be highlighted in{' '}
                  <em style={{ color: 'rgb(0, 80, 255)' }}>blue</em> bellow.
                </span>
              }
              color='rgb(255, 255, 255)'
            >
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
          <InputNumber
            className='w-[120px] !border border-solid !border-accent/70 !bg-surface1 hover:!border-accent hover:!bg-surface2 [&_input]:!text-text'
            min={0}
            value={gradeColumn}
            onChange={changeGradeColumn}
          />
        </Col>
      </Row>

      {data.length > 0 ?
        <>
          <Row className='mb-2' gutter={[10, 10]}>
            <Col>
              <Button
                className='custom-default-button'
                shape='circle'
                icon={editorCollapsed ? <RightOutlined /> : <DownOutlined />}
                onClick={() => {
                  setEditorCollapsed((prev) => !prev);
                }}
              ></Button>
            </Col>
            <Col>
              <Tooltip
                color='rgb(255, 255, 255)'
                title={<span className='text-text'>Add students from the course that are not in the data.</span>}
              >
                <Button className='custom-default-button' onClick={addMissing}>
                  Add Missing Students
                </Button>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip
                color='rgb(255, 255, 255)'
                title={<span className='text-text'>Filter out any student that is not part of the course.</span>}
              >
                <Button
                  className='custom-default-button'
                  onClick={() => {
                    setData(filterStudents());
                  }}
                >
                  Filter Students
                </Button>
              </Tooltip>
            </Col>
          </Row>
          {!editorCollapsed && (
            <>
              <Row className='mb-2'>
                <UploadEditor data={data} setData={setData} columns={{ grade: gradeColumn, id: idColumn }} />
              </Row>
            </>
          )}
        </>
      : <Row className='mb-2'>
          <Button
            className='custom-default-button w-[120px]'
            onClick={() => {
              setData([
                ['id', 'grade'],
                ['', ''],
              ]);
            }}
          >
            Manual Entry
          </Button>
        </Row>
      }

      <Row className='mb-2' gutter={[10, 10]}>
        <Col>
          <Button onClick={closeUploadMenu} className='custom-default-button'>
            Cancel
          </Button>
        </Col>
        <Col>
          <Button
            className='custom-default-button'
            onClick={() => {
              upload({ entryID: tile.id, idColumn, gradeColumn, data });
            }}
            loading={isPending}
            disabled={!validate(data)}
          >
            Upload
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default UploadManager;
