import { ChevronUp, ChevronDown } from 'lucide-react';
import './DataTable.css';

export default function DataTable({
  columns = [],
  data = [],
  actions,
  onSort,
  sortField,
  sortOrder = 'asc',
  loading = false,
  emptyMessage = 'No data found',
}) {
  const handleHeaderClick = (fieldName) => {
    if (onSort) {
      const newOrder = sortField === fieldName && sortOrder === 'asc' ? 'desc' : 'asc';
      onSort(fieldName, newOrder);
    }
  };

  if (loading) {
    return (
      <div className="data-table-container">
        <div className="table-loading">Loading...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="data-table-container">
        <div className="table-empty">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr className="table-header-row">
            {columns.map((col) => (
              <th
                key={col.field}
                className={`table-header-cell ${col.width ? '' : ''}`}
                style={col.width ? { width: col.width } : {}}
                onClick={() => col.sortable !== false && handleHeaderClick(col.field)}
              >
                <span className="header-content">
                  {col.label}
                  {col.sortable !== false && sortField === col.field && (
                    <span className="sort-icon">
                      {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  )}
                </span>
              </th>
            ))}
            {actions && <th className="table-header-cell actions-header">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-data-row">
              {columns.map((col) => (
                <td
                  key={`${rowIndex}-${col.field}`}
                  className="table-data-cell"
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.render ? col.render(row[col.field], row, rowIndex) : row[col.field]}
                </td>
              ))}
              {actions && (
                <td className="table-data-cell actions-cell">
                  <div className="actions-group">
                    {actions.map((action, idx) => (
                      <button
                        key={idx}
                        className={`action-btn action-${action.variant || 'primary'}`}
                        onClick={() => action.onClick?.(row)}
                        title={action.title || action.label}
                      >
                        {action.icon || action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
