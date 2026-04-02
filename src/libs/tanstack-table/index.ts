import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table'

export type TTableConfig<TData> = {
  data: TData[]
  columns: ColumnDef<TData>[]
  initialSorting?: SortingState
  initialPagination?: PaginationState
  initialColumnFilters?: ColumnFiltersState
  initialColumnVisibility?: VisibilityState
  initialRowSelection?: RowSelectionState
  enableRowSelection?: boolean
  manualPagination?: boolean
  manualSorting?: boolean
  manualFiltering?: boolean
  pageCount?: number
}

export const defaultPagination: PaginationState = {
  pageIndex: 0,
  pageSize: 10,
}

export {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
}

export type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
  RowSelectionState,
}
