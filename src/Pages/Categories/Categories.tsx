/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import { useForm, isNotEmpty } from "@mantine/form";
import { Button, Group, TextInput, Box } from "@mantine/core";

import { Category } from "../../types";
import { ListContext } from "../../context";
import { capitalizeFirstLetter } from "../../Shared/utils";

const Categories = () => {
  const { createCategory } = useContext(ListContext);
  const [categories, setCategories] = useState<Category[]>([]);

  const createCategoryForm = useForm({
    initialValues: {
      category: "",
    },

    validate: {
      category: isNotEmpty("Category name is required!"),
    },
  });

  const handleCreateCategory = (values: any) => {
    const updatedCategories = [...categories, values];
    setCategories(updatedCategories);

    createCategory(updatedCategories);

    createCategoryForm.reset();
  };

  const allCategoriesArray: Category[] = categories.map((category: any) => ({
    category: capitalizeFirstLetter(category?.category),
  }));

  const primitiveCategories = [
    ...new Set(allCategoriesArray.map((category) => category.category)),
  ].map((category) => ({ category }));

  useEffect(() => {
    const storedCategories = JSON.parse(
      localStorage.getItem("categoryList") || "[]"
    );

    setCategories(storedCategories);
  }, []);

  return (
    <Box>
      <Box
        component="form"
        maw={400}
        mx="auto"
        onSubmit={createCategoryForm.onSubmit((values) =>
          handleCreateCategory(values)
        )}
      >
        <TextInput
          label="Category Name"
          placeholder="Category name"
          withAsterisk
          {...createCategoryForm.getInputProps("category")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </Box>

      <Box mt="md" mx="auto">
        <h2>All Categories:</h2>
        {primitiveCategories.length > 0 ? (
          <ul>
            {primitiveCategories.map((category, index) => (
              <li key={index}>{category.category}</li>
            ))}
          </ul>
        ) : (
          <p>No data found!</p>
        )}
      </Box>
    </Box>
  );
};

export default Categories;
