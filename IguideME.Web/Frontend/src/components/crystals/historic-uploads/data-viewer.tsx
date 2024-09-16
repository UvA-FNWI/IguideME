import type { Submission } from '@/types/grades';
import type { TileEntry } from '@/types/tile';
import type { User } from '@/types/user';
import { Col, Row, Select, Table } from 'antd';
import { useState, type FC } from 'react';

interface DataViewerProps {
  tileEntry: TileEntry | undefined;
  submissions: Submission[];
  students: User[];
}

const DataViewer: FC<DataViewerProps> = ({ tileEntry, submissions, students }) => {
  const [query, setQuery] = useState<string>('');

  if (!tileEntry) return null;

  return (
    <div>
      <h1 className='mb-4 text-2xl'>{tileEntry.title}</h1>

      <Row>
        <Col xs={24} md={12}>
          <h2 className='mb-2 text-xl'>Student Grades</h2>

          <label>Find student by name</label>
          <Select
            className='mb-4 w-full border-accent/50 bg-surface1 text-text hover:border-accent hover:bg-surface2 focus:border-accent focus:shadow-sm focus:shadow-accent aria-invalid:!border-failure aria-invalid:shadow-none aria-invalid:focus:!shadow-sm aria-invalid:focus:!shadow-failure'
            size={'large'}
            value={query}
            showSearch
            placeholder={'Student name or id'}
            options={students.map((student) => ({
              label: `${student.name} (${student.userID})`,
              value: student.userID,
            }))}
            filterOption={(input, option) => {
              const label = option?.label?.toLowerCase() || '';
              const value = option?.value?.toLowerCase() || '';
              return label.includes(input.toLowerCase()) || value.includes(input.toLowerCase());
            }}
            onChange={(value) => {
              setQuery(value);
            }}
          />

          <Table
            className='custom-table'
            columns={[
              { title: 'Name', dataIndex: 'student_name', key: 'student_name' },
              { title: 'Student ID', dataIndex: 'student_id', key: 'student_id' },
              { title: 'Grade', dataIndex: 'grade', key: 'grade' },
            ]}
            dataSource={submissions
              .filter((s) => {
                const student = students.find((st) => s.userID === st.userID);
                return student ?
                    student.name.toLowerCase().includes(query.toLowerCase()) ||
                      student.userID.toLowerCase().includes(query.toLowerCase())
                  : false;
              })
              .sort((a, b) => b.grades.grade - a.grades.grade)
              .map((s, i) => {
                const student = students.find((st) => s.userID === st.userID);
                return {
                  key: i,
                  student_name: student ? student.name : '???',
                  student_id: student ? student.userID : '???',
                  grade: s.grades.grade,
                };
              })}
          />
        </Col>

        <Col xs={24} md={8}></Col>
      </Row>
    </div>
  );
};
export default DataViewer;
