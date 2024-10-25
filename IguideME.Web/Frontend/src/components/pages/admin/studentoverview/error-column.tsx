export const getErrorColumn = (type: string) => {
  return [
    {
      key: 'error',
      title: <div className='text-failure'>{'Error loading ' + type}</div>,
      dataIndex: 'error',
    },
  ];
};
