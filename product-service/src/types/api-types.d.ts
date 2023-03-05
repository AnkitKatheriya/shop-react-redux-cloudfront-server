export interface IProduct {
    description: string;
    id: string;
    price: number;
    title: string;
    count?: number;
  }
  
  export type Products = IProduct[];