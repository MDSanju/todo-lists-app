/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, isNotEmpty } from "@mantine/form";
import {
  Button,
  Group,
  TextInput,
  Box,
  Title,
  Tabs,
  Grid,
  rem,
} from "@mantine/core";
import { IconCategory, IconHome } from "@tabler/icons-react";

import { Category } from "../../types";
import { ListContext } from "../../context";
import { capitalizeFirstLetter } from "../../Shared/utils";

const Categories = () => {
  const { createCategory } = useContext(ListContext);
  const [categories, setCategories] = useState<Category[]>([]);

  const navigate = useNavigate();

  const iconStyle = { width: rem(16), height: rem(16) };

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

  const landHome = () => {
    navigate("/home");
  };

  const landCategories = () => {
    navigate("/categories");
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
    <Box style={{ margin: "24px 42px 64px 42px" }}>
      <Title
        order={2}
        mb={24}
        style={{ display: "flex", justifyContent: "center" }}
      >
        TODO List Items
      </Title>

      <Box>
        <Tabs defaultValue="categories">
          <Tabs.List>
            <Tabs.Tab
              value="gallery"
              onClick={landHome}
              leftSection={<IconHome stroke={1.5} style={iconStyle} />}
            >
              Home
            </Tabs.Tab>
            <Tabs.Tab
              value="categories"
              onClick={landCategories}
              leftSection={<IconCategory stroke={1.5} style={iconStyle} />}
            >
              Categories
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Box>

      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Box
            component="form"
            mt={48}
            style={{ width: "100%" }}
            onSubmit={createCategoryForm.onSubmit((values) =>
              handleCreateCategory(values)
            )}
          >
            <TextInput
              label="Category Name"
              placeholder="Category name"
              variant="filled"
              withAsterisk
              {...createCategoryForm.getInputProps("category")}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </Box>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Box mt={48} style={{ width: "100%" }}>
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
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default Categories;
