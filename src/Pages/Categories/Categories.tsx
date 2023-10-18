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
  Card,
  Text,
  Alert,
  Tooltip,
  Pagination,
} from "@mantine/core";
import {
  IconCategory,
  IconCopy,
  IconDatabaseOff,
  IconHome,
} from "@tabler/icons-react";

import { Category } from "../../types";
import { ListContext } from "../../context";
import { capitalizeFirstLetter } from "../../Shared/utils";

const Categories = () => {
  const { createCategory } = useContext(ListContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const categoriesPerPage = 5;

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

  const copyToClipboard = async (text: any) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
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

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * categoriesPerPage;
  const endIndex = Math.min(
    startIndex + categoriesPerPage,
    primitiveCategories.length
  );
  const categoriesToShow = primitiveCategories.slice(startIndex, endIndex);

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
          <Text fw={500} mt={32} mb={8}>
            Add A New Category
          </Text>
          <Card shadow="sm" withBorder>
            <Box
              component="form"
              style={{ width: "100%", padding: "8px 8px" }}
              onSubmit={createCategoryForm.onSubmit((values) =>
                handleCreateCategory(values)
              )}
            >
              <Text size="sm" c="gray" mb={16}>
                User can add a new category, added category can apply to add a
                new item at homepage.
              </Text>
              <TextInput
                label="Category Name"
                placeholder="Category name"
                variant="filled"
                withAsterisk
                {...createCategoryForm.getInputProps("category")}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">Add Category</Button>
              </Group>
            </Box>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Text fw={500} mt={32} mb={8}>
            List of Categories
          </Text>
          <Card shadow="sm" withBorder mb={48}>
            <Box style={{ width: "100%", padding: "8px 8px" }}>
              <Text size="sm" c="gray" mb={16}>
                User can see all added categories here.
              </Text>

              <Box mt="md">
                <Text fw={700} mt={24} mb={8} size="xl">
                  Category Lists:
                </Text>
                {categoriesToShow.length > 0 ? (
                  <>
                    {categoriesToShow.map((category, index) => (
                      <Box key={index} mb={16}>
                        <Group justify="space-between" grow gap={0}>
                          <Alert
                            variant="light"
                            color="rgba(27, 117, 135, 0.65)"
                            title={category.category}
                            icon={<IconCategory size={20} stroke={1.5} />}
                            style={{ width: "86%" }}
                          ></Alert>

                          <Box style={{ width: "8%", paddingLeft: "8px" }}>
                            <Tooltip
                              label={copied ? "Copied!" : "Copy Clipboard!"}
                              withArrow
                            >
                              <IconCopy
                                size={25}
                                stroke={1.5}
                                color="gray"
                                cursor="pointer"
                                onClick={() =>
                                  copyToClipboard(category.category)
                                }
                              />
                            </Tooltip>
                          </Box>
                        </Group>
                      </Box>
                    ))}
                  </>
                ) : (
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "24px",
                    }}
                  >
                    <IconDatabaseOff color="gray" size={24} stroke={1.5} />
                    <Text fz="xs" color="gray">
                      No records
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
            <Pagination
              total={Math.ceil(primitiveCategories.length / categoriesPerPage)}
              value={currentPage}
              onChange={handlePageChange}
              mb={16}
            />
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default Categories;
