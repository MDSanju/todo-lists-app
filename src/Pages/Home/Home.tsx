import React, { useContext, useEffect, useState } from "react";
import { useForm, isNotEmpty } from "@mantine/form";
import { Button, Group, TextInput, Box, Select } from "@mantine/core";

import { ListContext } from "../../context";
import { Item } from "../../types";

const Home = () => {
  const { createItem } = useContext(ListContext);
  const [items, setItems] = useState<Item[]>([]);

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

      <Box mt="xl">
        <h2>All Items:</h2>
        <ul>
          {items.map((item, index) => (
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
