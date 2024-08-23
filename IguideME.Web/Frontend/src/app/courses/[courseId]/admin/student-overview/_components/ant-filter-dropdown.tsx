/* eslint-disable -- I did not make this file */
/* @ts-nocheck */

// Created by Ant Design
// Source: https://ant.design/components/table
// View date: 2024-07-07
// Changes: Changed styles to adapt to the project's design.

import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, type InputRef, Space, type TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/lib/table/interface';

import type { TableData } from '@/app/courses/[courseId]/admin/student-overview/page';

type DataType = keyof TableData;

export function useAntFilterDropdown({ dataIndex }: { dataIndex: DataType }): TableColumnType<DataType> {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps['confirm'], di: DataType): void => {
    confirm();
    setSearchText(selectedKeys[0] ?? '');
    setSearchedColumn(di);
  };

  // TODO: The filters are not correctly reset when the user clicks on the reset button
  const handleReset = (clearFilters: () => void): void => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (di: DataType): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <Button
        className='bg-surface1 border-2 border-primary p-2'
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${di}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => {
            handleSearch(selectedKeys as string[], confirm, di);
          }}
          className='bg-surface1 text-text hover:bg-surface2 aria-invalid:!border-failure aria-invalid:shadow-none aria-invalid:focus:!shadow-sm aria-invalid:focus:!shadow-failure mb-2 block border-accent/50 hover:border-accent focus:border-accent focus:shadow-sm focus:shadow-accent'
        />
        <Space>
          <Button
            type='primary'
            onClick={() => {
              handleSearch(selectedKeys as string[], confirm, di);
            }}
            icon={<SearchOutlined className='text-text' />}
            size='small'
            className='custom-default-button w-20'
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
            }}
            size='small'
            className='custom-default-button w-20'
          >
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            className='text-text hover:!text-text focus:!text-text underline'
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </Button>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined className='text-text' />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ?
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      : text,
  });

  return getColumnSearchProps(dataIndex);
}
