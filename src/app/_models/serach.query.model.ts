export interface SearchQuery {
    Id?: string;
    Name: string;
    Keyword: string;
    Type?: string;
    Item: any;
}

export interface SearchQueryGroup {
    Type?: string;
    SearchQuery: SearchQuery[];

}

