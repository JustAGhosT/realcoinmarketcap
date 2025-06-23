import type React from "react"
import styles from "./data-table.module.css"

interface Column {
  key: string
  header: string
  className?: string
}

interface DataTableProps {
  columns: Column[]
  data: Record<string, string>[]
  className?: string
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data, className = "" }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={`${styles.table} ${className}`}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`${styles.th} ${column.className || ""}`}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map((row, index) => (
            <tr key={index} className={index % 2 === 1 ? styles.evenRow : ""}>
              {columns.map((column) => (
                <td key={column.key} className={styles.td} dangerouslySetInnerHTML={{ __html: row[column.key] }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
