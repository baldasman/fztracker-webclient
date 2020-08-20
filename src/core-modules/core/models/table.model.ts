// import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

import { QueryParamsModel } from './query-params.model';

export class TableModel {
  displayedColumns: string[];
  // paginator?: MatPaginator;
  query: QueryParamsModel;
  refreshTableDataEvent: (query?: QueryParamsModel) => void;
  dataSource?: MatTableDataSource<any>;
  totalRows?: number;
  selection?: SelectionModel<any>;
  pageSize?: number;
  pageSizeOptions?: number[];
  tableLoading?: boolean;

  constructor(data: Partial<TableModel>) {

    Object.assign(this, data);

    if (!data.selection) {
      this.selection = new SelectionModel<any>(true, []);
    }
    if (!data.displayedColumns) {
      this.displayedColumns = [];
    }
    if (!data.dataSource) {
      this.dataSource = new MatTableDataSource([]);
    }
    if (!data.totalRows) {
      this.totalRows = 0;
    }
    if (!data.pageSize) {
      this.pageSize = 10;
    }
    if (!data.pageSizeOptions) {
      this.pageSizeOptions = [5, 10, 25];
    }
    if (!data.tableLoading) {
      this.tableLoading = true;
    }

  }

  tableEventHandler(event: { [key: string]: string | number }, type: string) {

    switch (type) {
      case 'sort':
        this.query.orderBy = event.active as string;
        this.query.orderDir = event.direction as string;
        // this.paginator.pageIndex = 0;
        break;
      case 'pagination':
        let page = (event.pageIndex as number) + 1;
        if (event.pageSize !== this.pageSize) {
          page = 1;
          // this.paginator.pageIndex = 0;
          this.pageSize = event.pageSize as number;
        }
        this.query.page = page;
        this.query.rowsPerPage = this.pageSize;
        break;
      default:
        break;
    }

    this.refreshTableDataEvent(this.query);

  }

  public hasAllRowsSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public toggleAllRowsSelection() {
    if (this.selection.selected.length !== 0 && this.hasAllRowsSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  public clearData() {
    this.dataSource.data = [];
    this.totalRows = 0;
    this.tableLoading = false;
  }

  // public setInitialPage() {
  //   this.paginator.pageIndex = 0;
  // }

  public setData(data: Array<any>, totalRows: number) {
    this.dataSource.data = data;
    this.totalRows = totalRows;
    this.tableLoading = false;
  }

  public setLoading(loading) {
    this.tableLoading = loading;
  }
}
