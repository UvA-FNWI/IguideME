// Created by Ant Design
// Source: https://ant.design/components/table
// View date: 2024-07-07
// Changes: Changed styles to adapt to the project's design.

import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, type InputRef, type TableColumnType } from 'antd';
import type { FilterDropdownProps } from 'antd/lib/table/interface';
import { useRef, useState } from 'react';
import type { TableData } from './studentoverview';
import Highlighter from 'react-highlight-words';

type DataType = keyof TableData;

export const useAntFilterDropdown = (dataIndex: DataType): TableColumnType<DataType> => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps['confirm'], dataIndex: DataType): void => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  // TODO: The filters are not correctly reset when the user clicks on the reset button
  const handleReset = (clearFilters: () => void): void => {
    clearFilters();
    setSearchText('');
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
};
