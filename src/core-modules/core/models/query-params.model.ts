// import { cloneDeep } from 'lodash';

export class QueryParamsModel {
  orderBy?: string;
  orderDir?: string; // asc || desc
  page?: number;
  rowsPerPage?: number;
  search?: string;
  filters?: { [key: string]: string | number | boolean };

  constructor(data?: Partial<QueryParamsModel>) {
    this.setData(data);
  }

  setData(data: Partial<QueryParamsModel>) {
    this.orderBy = data.orderBy;
    this.orderDir = data.orderDir;
    this.page = data.page || 1;
    this.rowsPerPage = data.rowsPerPage || 10;
    this.search = data.search;
    this.filters = data.filters;

    // const dataAux = cloneDeep(data); // references issue

    // if (dataAux.filters?.search) {
    //   this.search = dataAux.filters.search as string;
    //   delete dataAux.filters.search;
    // } else {
    //   // resetting search in case it was previously populated
    //   this.search = null;
    // }
    // Object.assign(this, dataAux);
  }

  setInitialPage() { this.page = 1; }

}
