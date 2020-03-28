export interface PageBean<T> {
    total: number;
    offset: number;
    limit: number;
    numberOfElements: number;
    included: T[];
}
