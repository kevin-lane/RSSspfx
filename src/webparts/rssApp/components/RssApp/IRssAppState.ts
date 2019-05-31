export interface IRssItem{
    title: string;
    description: string;
    author: string;
    showPanel: boolean;
    numberOfNewsItems: number;
}

//export interface 

export interface IRssAppState{ 
    items: IRssItem[];
}