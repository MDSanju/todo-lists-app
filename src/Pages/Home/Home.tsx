/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import { useForm, isNotEmpty } from "@mantine/form";
import {
  Button,
  Group,
  TextInput,
  Box,
  Select,
  CloseButton,
} from "@mantine/core";

import { ListContext } from "../../context";
import { Category, Item, SelectInput } from "../../types";
import { capitalizeFirstLetter } from "../../Shared/utils";

const Home = () => {
  const { createItem } = useContext(ListContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [findItem, setFindItem] = useState<string>("");

  const createItemForm = useForm({
    initialValues: {
      itemName: "",
      itemCategory: "",
    },

    validate: {
      itemName: isNotEmpty("Item name is required!"),
      itemCategory: isNotEmpty("Select an item category!"),
    },
  });

  const handleCreateItem = (values: Item) => {
    const updatedItems = [...items, values];
    setItems(updatedItems);

    createItem(updatedItems);

    createItemForm.reset();
  };

  const allCategoriesArray: SelectInput[] = categories.map((category: any) => ({
    value: capitalizeFirstLetter(category?.category),
    label: category?.category,
  }));

  const selectCategory = [
    ...new Set(allCategoriesArray.map((category) => category.value)),
  ].map((value) => ({ value, label: value }));

  let filteredItems;

  if (searchQuery.length > 0) {
    filteredItems = items.filter((item) =>
      item.itemName.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  } else if (findItem.length > 0) {
    filteredItems = items.filter((item) =>
      item.itemCategory.toLowerCase().includes(findItem?.toLowerCase())
    );
  } else {
    filteredItems = items;
  }

  const itemCategoriesArray: SelectInput[] = items.map((item: any) => ({
    value: capitalizeFirstLetter(item?.itemCategory),
    label: item?.itemCategory,
  }));

  const selectData = [
    ...new Set(itemCategoriesArray.map((item) => item.value)),
  ].map((value) => ({ value, label: value }));

  const findByCategory = (item: string) => {
    if (typeof item === "string") {
      setFindItem(item);
    } else {
      setFindItem("");
    }
  };

  useEffect(() => {
    const storedCategories = JSON.parse(
      localStorage.getItem("categoryList") || "[]"
    );

    setCategories(storedCategories);
  }, []);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("listItems") || "[]");

    setItems(storedItems);
  }, []);

  return (
    <Box>
      <Box
        component="form"
        maw={400}
        mx="auto"
        onSubmit={createItemForm.onSubmit((values) => handleCreateItem(values))}
      >
        <TextInput
          label="Item Name"
          placeholder="Item name"
          withAsterisk
          {...createItemForm.getInputProps("itemName")}
        />

        <Select
          label="Item Categories"
          placeholder="Select category"
          data={selectCategory}
          withScrollArea={false}
          styles={{ dropdown: { maxHeight: 200, overflowY: "auto" } }}
          mt="md"
          withAsterisk
          clearable
          {...createItemForm.getInputProps("itemCategory")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </Box>

      <Box mx="auto" mt="xl" style={{ width: "400px" }}>
        <TextInput
          placeholder="Search items"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          rightSection={
            <CloseButton
              c="gray"
              size={24}
              aria-label="Clear input"
              onClick={() => setSearchQuery("")}
              style={{ display: searchQuery ? undefined : "none" }}
            />
          }
        />
      </Box>

      <Box mx="auto" mt="xl" style={{ width: "400px" }}>
        <Select
          label="Item Categories"
          placeholder="Select category"
          data={selectData}
          withScrollArea={false}
          styles={{ dropdown: { maxHeight: 200, overflowY: "auto" } }}
          mt="md"
          withAsterisk
          clearable
          onChange={findByCategory}
        />
      </Box>

      <Box mt="md" mx="auto">
        <h2>All Items:</h2>
        {filteredItems.length > 0 ? (
          <ul>
            {filteredItems.map((item, index) => (
              <li key={index}>
                {item.itemName} - {item.itemCategory}
              </li>
            ))}
          </ul>
        ) : (
          <p>No data found!</p>
        )}
      </Box>
    </Box>
  );
};

export default Home;
