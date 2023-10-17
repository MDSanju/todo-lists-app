/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";

import { Item, ListContextProps, ListContextProviderProps } from "../types";

const initialContext: ListContextProps = {
  createItem: () => {},
};

export const ListContext = createContext<ListContextProps>(initialContext);

export default function ListProvider({ children }: ListContextProviderProps) {
  const createItem = (items: Item[]) => {
    console.log(items);

    const existingItems = JSON.parse(localStorage.getItem("listItems") || "[]");

    items.forEach((item) => {
      existingItems.push(item);
    });

    const updatedItems = JSON.stringify(existingItems);

    localStorage.setItem("listItems", updatedItems);

    console.log(localStorage.getItem("listItems"));
  };

  const contextValue: ListContextProps = {
    createItem,
  };

  return (
    <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>
  );
}
