export enum SearchOperator {
    'EQ' = 'EQ',
    'IN' = 'IN',
    'NOT' = 'NOT',
    'GT' = 'GT',
    'LT' = 'LT',
    'GTE' = 'GTE',
    'LTE' = 'LTE',
    'LIKE' = 'LIKE',
    'STARTS_WITH' = 'STARTS_WITH',
    'ENDS_WITH' = 'ENDS_WITH',
    'CONTAINS' = 'CONTAINS',
    'NULL' = 'NULL'
}

export interface SearchCriteria {
    key: string;
    operation: SearchOperator;
    value: any;
}
