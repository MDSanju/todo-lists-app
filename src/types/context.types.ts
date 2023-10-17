export interface Item {
  itemName: string;
  itemCategory: string;
}

export interface Category {
  category: string;
}

export interface ListContextProps {
  createItem: (items: Item[]) => void;
  createCategory: (items: Category[]) => void;
}

export interface ListContextProviderProps {
  children: React.ReactNode;
}
