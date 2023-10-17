/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from "react";

import {
  Category,
  Item,
  ListContextProps,
  ListContextProviderProps,
} from "../types";

const initialContext: ListContextProps = {
  createItem: () => {},
  createCategory: () => {},
};

export const ListContext = createContext<ListContextProps>(initialContext);

export default function ListProvider({ children }: ListContextProviderProps) {
  const createItem = (items: Item[]) => {
    const existingItems = JSON.parse(localStorage.getItem("listItems") || "[]");

    items.forEach((item) => {
      existingItems.push(item);
    });

    const updatedItems = JSON.stringify(existingItems);

    localStorage.setItem("listItems", updatedItems);

    console.log(localStorage.getItem("listItems"));
  };

  const createCategory = (categories: Category[]) => {
    const existingCategories = JSON.parse(
      localStorage.getItem("categoryList") || "[]"
    );

    categories.forEach((category) => {
      existingCategories.push(category);
    });

    const updatedCategories = JSON.stringify(existingCategories);

    localStorage.setItem("categoryList", updatedCategories);
  };

  const contextValue: ListContextProps = {
    createItem,
    createCategory,
  };

  return (
    <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>
  );
}
