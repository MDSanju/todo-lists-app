export interface Item {
  itemName: string;
  itemCategory: string;
}

export interface ListContextProps {
  createItem: (items: Item[]) => void;
}

export interface ListContextProviderProps {
  children: React.ReactNode;
}
