// Generic UI component types
export interface TableColumn {
  title: string
  key: string
  dataIndex?: string
  sorter?: boolean
  width?: number
}

export interface PaginationConfig {
  current: number
  pageSize: number
  total: number
  showSizeChanger: boolean
  showQuickJumper: boolean
  showTotal: (total: number, range: [number, number]) => string
}

export interface TableChangeEvent {
  page: number
}

export interface SortChangeEvent {
  sortField: string
  sortOrder: number
}

// Form related types
export interface FormErrors {
  [key: string]: string
}

export interface SelectOption {
  label: string
  value: string | null
}

// Modal types
export interface ModalProps {
  visible: boolean
}

export interface ModalEmits {
  'update:visible': [visible: boolean]
}
