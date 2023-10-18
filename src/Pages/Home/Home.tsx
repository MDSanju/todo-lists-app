/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, isNotEmpty } from "@mantine/form";
import {
  Button,
  Group,
  TextInput,
  Box,
  Select,
  CloseButton,
  Grid,
  Title,
  Tabs,
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
  IconListDetails,
  IconSearch,
} from "@tabler/icons-react";

import { ListContext } from "../../context";
import { Category, Item, SelectInput } from "../../types";
import { capitalizeFirstLetter } from "../../Shared/utils";

const Home = () => {
  const { createItem } = useContext(ListContext);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [findItem, setFindItem] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const navigate = useNavigate();

  const iconStyle = { width: rem(16), height: rem(16) };

  const allCategoriesArray: SelectInput[] = categories.map((category: any) => ({
    value: capitalizeFirstLetter(category?.category),
    label: category?.category,
  }));

  const selectCategory = [
    ...new Set(allCategoriesArray.map((category) => category.value)),
  ].map((value) => ({ value, label: value }));

  const createItemForm = useForm({
    initialValues: {
      itemName: "",
      itemCategory: "",
    },

    validate: {
      itemName: isNotEmpty("Item name is required!"),
      itemCategory: isNotEmpty(
        selectCategory.length
          ? "Select an item category!"
          : "Please create categories!"
      ),
    },
  });

  const handleCreateItem = (values: Item) => {
    const updatedItems = [...items, values];
    setItems(updatedItems);

    createItem(updatedItems);

    createItemForm.reset();
  };

  const uniqueItemIdentifiers = new Set();

  const uniqueItems = items.filter((item) => {
    const itemIdentifier = `${item.itemName.toLowerCase()}-${item.itemCategory.toLowerCase()}`;
    if (uniqueItemIdentifiers.has(itemIdentifier)) {
      return false;
    }

    uniqueItemIdentifiers.add(itemIdentifier);
    return true;
  });

  const handlePageChange = (newPage: any) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, uniqueItems.length);
  const itemsToShow = uniqueItems.slice(startIndex, endIndex);

  let filteredItems;

  if (searchQuery.length > 0) {
    filteredItems = uniqueItems.filter((item) =>
      item.itemName.toLowerCase().includes(searchQuery?.toLowerCase())
    );
  } else if (findItem.length > 0) {
    filteredItems = uniqueItems.filter((item) =>
      item.itemCategory.toLowerCase().includes(findItem?.toLowerCase())
    );
  } else {
    filteredItems = itemsToShow;
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

  const landHome = () => {
    navigate("/home");
  };

  const landCategories = () => {
    navigate("/categories");
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
    <Box style={{ margin: "24px 42px 64px 42px" }}>
      <Title
        order={2}
        mb={24}
        style={{ display: "flex", justifyContent: "center" }}
      >
        TODO List Items
      </Title>

      <Box>
        <Tabs defaultValue="gallery">
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
            Add A New Item
          </Text>
          <Card shadow="sm" withBorder>
            <Box
              component="form"
              style={{ width: "100%", padding: "8px 8px" }}
              onSubmit={createItemForm.onSubmit((values) =>
                handleCreateItem(values)
              )}
            >
              <Text size="sm" c="gray" mb={16}>
                User can add a new item to the list by an item mane and
                selecting an item category.
              </Text>
              <TextInput
                label="Item Name"
                placeholder="Item name"
                variant="filled"
                withAsterisk
                {...createItemForm.getInputProps("itemName")}
              />

              <Select
                label="Item Categories"
                placeholder="Select category"
                variant="filled"
                data={selectCategory}
                withScrollArea={false}
                styles={{ dropdown: { maxHeight: 200, overflowY: "auto" } }}
                mt="md"
                withAsterisk
                clearable
                {...createItemForm.getInputProps("itemCategory")}
              />

              <Group justify="flex-end" mt="md">
                <Button type="submit">Add Item</Button>
              </Group>
            </Box>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
          <Text fw={500} mt={32} mb={8}>
            List of Items
          </Text>
          <Card shadow="sm" withBorder mb={48}>
            <Box style={{ width: "100%", padding: "8px 8px" }}>
              <Text size="sm" c="gray" mb={16}>
                User can search items by item name & filter items by selecting
                category and view items list.
              </Text>
              <Grid>
                <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                  <Box>
                    <TextInput
                      label="Search by Item Name"
                      placeholder="Search item"
                      variant="filled"
                      leftSection={<IconSearch size={16} stroke={1.5} />}
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.currentTarget.value)
                      }
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
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                  <Box>
                    <Select
                      label="Filter Items by Category"
                      placeholder="Select category"
                      variant="filled"
                      data={selectData}
                      withScrollArea={false}
                      styles={{
                        dropdown: { maxHeight: 200, overflowY: "auto" },
                      }}
                      clearable
                      onChange={findByCategory}
                    />
                  </Box>
                </Grid.Col>
              </Grid>

              <Box mt="md">
                <Text fw={700} mt={24} mb={8} size="xl">
                  List Items:
                </Text>
                {filteredItems.length > 0 ? (
                  <>
                    {filteredItems.map((item, index) => (
                      <Box key={index} mb={16}>
                        <Group justify="space-between" grow gap={0}>
                          <Alert
                            variant="light"
                            color="rgba(27, 117, 135, 0.65)"
                            title={item.itemName}
                            icon={<IconListDetails size={20} stroke={1.5} />}
                            style={{ width: "86%" }}
                          >
                            Category: {item.itemCategory}
                          </Alert>

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
                                onClick={() => copyToClipboard(item.itemName)}
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
            {searchQuery.length === 0 && findItem.length === 0 && (
              <Pagination
                total={Math.ceil(uniqueItems.length / itemsPerPage)}
                value={currentPage}
                onChange={handlePageChange}
                mb={16}
              />
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default Home;
