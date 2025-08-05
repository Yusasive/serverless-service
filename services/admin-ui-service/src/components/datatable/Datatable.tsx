import ReactDataTable, { TableColumn, createTheme } from 'react-data-table-component';

type Props<T> = {
  title?: string;
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: boolean;
};

createTheme('custom', {
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
  },
  background: {
    default: '#ffffff',
  },
  divider: {
    default: '#E5E7EB',
  },
  highlightOnHover: '#F9FAFB',
  context: {
    background: '#10B981',
    text: '#ffffff',
  },
});

function DataTable<T>({
  title,
  columns,
  data,
  loading = false,
  pagination = true,
}: Props<T>) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      {title && <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>}
      <ReactDataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination={pagination}
        highlightOnHover
        responsive
        persistTableHead
        theme="custom"
        customStyles={{
          rows: {
            style: {
              minHeight: '56px',
              fontSize: '14px',
            },
          },
          headCells: {
            style: {
              fontWeight: '700',
              fontSize: '13px',
              backgroundColor: '#F3F4F6', // Tailwind gray-100
              color: '#374151', // Tailwind gray-700
            },
          },
          cells: {
            style: {
              padding: '12px 16px',
            },
          },
        }}
      />
    </div>
  );
}

export default DataTable;
