// Created by Ant Design
// Source: https://ant.design/components/table
// View date: 2024-07-07
// Changes: Changed styles to adapt to the project's design.

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, type InputRef, type TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/lib/table/interface';
import { useRef, useState } from 'react';
import type { CommonData } from './common-table';
import Highlighter from 'react-highlight-words';

type DataType = keyof CommonData;

export const useAntFilterDropdown = (dataIndex: DataType): TableColumnType<DataType> => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps['confirm'], dataIndex: DataType): void => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void, confirm: FilterDropdownProps['confirm']): void => {
    clearFilters();
    setSearchText('');
    confirm();
  };

  const getColumnSearchProps = (dataIndex: DataType): TableColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        className='border-2 border-primary bg-surface1 p-2'
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => {
            handleSearch(selectedKeys as string[], confirm, dataIndex);
          }}
          className='mb-2 block border-accent/50 bg-surface1 text-text hover:border-accent hover:bg-surface2 focus:border-accent focus:shadow-sm focus:shadow-accent aria-invalid:!border-failure aria-invalid:shadow-none aria-invalid:focus:!shadow-sm aria-invalid:focus:!shadow-failure'
        />
        <Space>
          <Button
            type='primary'
            onClick={() => {
              handleSearch(selectedKeys as string[], confirm, dataIndex);
            }}
            icon={<SearchOutlined className='text-text' />}
            size='small'
            className='custom-default-button w-20'
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters, confirm);
            }}
            size='small'
            className='custom-default-button w-20'
          >
            Reset
          </Button>
          <Button
            type='link'
            size='small'
            className='text-text underline hover:!text-text focus:!text-text'
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: () => <SearchOutlined className='text-text' />,
    onFilter: (value, record) => {
      const searchValue = (value as string).toLowerCase();
      return (
        record[dataIndex as any].toString().toLowerCase().includes(searchValue) ||
        (record as unknown as CommonData).student.userID.toString().toLowerCase().includes(searchValue)
      );
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text, record: any) => (
      <div>
        <div className='w-full'>
          {searchedColumn === dataIndex ?
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={(text as string | undefined) ? text.toString() : ''}
            />
          : text}
        </div>
        <div className='px-2 text-xs'>
          {searchedColumn === dataIndex ?
            <Highlighter
              highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={record.student.userID.toString()}
            />
          : record.student.userID}
        </div>
      </div>
    ),
  });

  return getColumnSearchProps(dataIndex);
};
