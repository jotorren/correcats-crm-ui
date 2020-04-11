export interface SearchCriteria {
    key: string;
    operation: 'EQ' | 'IN' | 'NOT' | 'GT' | 'LT' | 'GTE' | 'LTE' | 'LIKE' | 'STARTS_WITH' | 'ENDS_WITH' | 'CONTAINS';
    value: any;
}
