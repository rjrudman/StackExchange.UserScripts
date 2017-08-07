// Everything is optional, as it's possible to turn off fields via filters.
export interface SEApiWrapper<TResultType> {
    items?: TResultType[];
    has_more?: boolean;
    quota_max?: number;
    quota_remaining?: number;

    backoff?: number;
    error_id?: number;
    error_message?: string;
    error_name?: string;

    page?: number;
    page_size?: number;

    total?: number;
    type?: string;
}