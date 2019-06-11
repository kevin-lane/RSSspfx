export interface IRssItem {
    title: string;
    description: string;
    author: string;
    showPanel: boolean;
    numberOfNewsItems: number;
    url: string;
}
export interface IRssAppState {
    items: IRssItem[];
}
