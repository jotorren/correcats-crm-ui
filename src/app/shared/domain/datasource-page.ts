import { Observable } from 'rxjs';

export enum SortOrder {
  'asc',
  'desc'
}

export interface Sort<T> {
  property: keyof T;
  order: SortOrder;
}

export interface PageRequest<T> {
  page: number;
  size: number;
  sort?: Sort<T>;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  size: number;
  number: number;
}

export type PaginatedEndpoint<T, Q> = (pageable: PageRequest<T>, query: Q) => Observable<Page<T>>;
