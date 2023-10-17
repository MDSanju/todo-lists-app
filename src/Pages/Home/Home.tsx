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
import { Item } from "../../types";

const Home = () => {
  const { createItem } = useContext(ListContext);
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const filteredItems = items.filter((item) =>
    item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          data={[
            { value: "food", label: "Food" },
            { value: "device", label: "Device" },
          ]}
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

      <Box mt="md" mx="auto">
        <h2>All Items:</h2>
        <ul>
          {filteredItems.map((item, index) => (
            <li key={index}>
              {item.itemName} - {item.itemCategory}
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

export default Home;
