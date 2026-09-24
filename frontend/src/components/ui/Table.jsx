import { cn } from '../../lib/cn'

/**
 * Table — dense data table with sticky header, row hover, onRowClick.
 *
 * @prop {Array}    columns   — [{ key, label, width?, align?: 'left'|'right'|'center', className? }]
 * @prop {Array}    rows      — array of row data objects
 * @prop {Function} onRowClick — (row) => void
 * @prop {string}   emptyMessage
 * @prop {boolean}  loading
 * @prop {Function} renderCell  — (column, row) => ReactNode  (optional override)
 */
export function Table({
  columns = [],
  rows = [],
  onRowClick,
  emptyMessage = 'No data',
  loading = false,
  renderCell,
  className,
  stickyHeader = true,
}) {
  const alignClass = (align) => {
    if (align === 'right')  return 'text-right'
    if (align === 'center') return 'text-center'
    return 'text-left'
  }

  return (
    <div className={cn('relative w-full overflow-auto', className)}>
      <table className="w-full border-collapse table-auto">
        {/* ── Header ────────────────────────────────────────────── */}
        <thead
          className={cn(
            'bg-surface',
            stickyHeader && 'sticky top-0 z-10'
          )}
        >
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  'py-2 px-3 border-b border-border-default',
                  'text-xs font-medium uppercase tracking-wider text-text-tertiary',
                  'whitespace-nowrap select-none',
                  alignClass(col.align),
                  col.className
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ──────────────────────────────────────────────── */}
        <tbody>
          {rows.length === 0 && !loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 text-center text-sm text-text-tertiary"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIdx) => (
              <tr
                key={row.id ?? rowIdx}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-border-subtle',
                  'transition-colors duration-100',
                  onRowClick
                    ? 'cursor-pointer hover:bg-elevated'
                    : 'hover:bg-elevated/50'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'py-2.5 px-3 text-sm text-text-primary',
                      'table-row-dense align-middle',
                      alignClass(col.align),
                      col.cellClassName
                    )}
                  >
                    {renderCell
                      ? renderCell(col, row)
                      : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

Table.displayName = 'Table'
export default Table
