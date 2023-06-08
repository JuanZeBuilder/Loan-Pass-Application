// General imports
import React, { useMemo } from "react";

// Chakra imports
import {
  Button,
  Flex,
  Icon,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import {
  TiArrowSortedDown,
  TiArrowSortedUp,
  TiArrowUnsorted,
} from "react-icons/ti";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

function DynamicTable(props) {
  const { title, createItem, columnsData, tableData } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    gotoPage,
    pageCount,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    setPageSize,
    setGlobalFilter,
    state,
  } = tableInstance;

  const createPages = (count) => {
    let arrPageCount = [];

    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }

    return arrPageCount;
  };

  const { pageIndex, pageSize, globalFilter } = state;

  return (
    <Card mb="22px" overflowX={{ sm: "scroll", xl: "hidden" }}>
      <Flex direction="column" w="100%">
        <CardHeader p="6px 0px 6px 0px" justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold">
            {title}
          </Text>
          {createItem}
        </CardHeader>
        <CardBody flexDirection="column">
          <Flex justify="space-between" align="center" w="100%">
            <Stack
              direction={{ sm: "row", md: "row" }}
              spacing={{ sm: "4px", md: "12px" }}
              align="center"
              me="12px"
              my="24px"
              minW={{ sm: "100px", md: "200px" }}
            >
              <Select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                color="gray.500"
                size="sm"
                borderRadius="12px"
                maxW="75px"
                cursor="pointer"
              >
                <option>5</option>
                <option>10</option>
                <option>15</option>
                <option>20</option>
                <option>25</option>
              </Select>
              <Text fontSize="xs" color="gray.400" fontWeight="normal">
                entries per page
              </Text>
            </Stack>
            <Input
              type="text"
              placeholder="Search..."
              minW="75px"
              maxW="175px"
              fontSize="sm"
              _focus={{ borderColor: "blue.500" }}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </Flex>
          <Table
            {...getTableProps()}
            variant="simple"
            color="gray.500"
            mb="24px"
          >
            <Thead>
              {headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      ps="0px"
                    >
                      <Flex
                        justify="space-between"
                        align="center"
                        fontSize={{ sm: "10px", lg: "12px" }}
                        color="gray.400"
                      >
                        {column.render("Header")}
                        {column.canSort ? (
                          <Icon
                            w={{ sm: "10px", md: "14px" }}
                            h={{ sm: "10px", md: "14px" }}
                            color={columns.isSorted ? "gray.500" : "gray.400"}
                            float="right"
                            as={
                              column.isSorted
                                ? column.isSortedDesc
                                  ? TiArrowSortedDown
                                  : TiArrowSortedUp
                                : TiArrowUnsorted
                            }
                          />
                        ) : null}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <Td
                          {...cell.getCellProps()}
                          fontSize={{ sm: "14px" }}
                          px="0px"
                        >
                          {cell.render("Cell")}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          <Flex
            direction={{ sm: "column", md: "row" }}
            justify="space-between"
            align="center"
            w="100%"
          >
            <Text
              fontSize="sm"
              color="gray.500"
              fontWeight="normal"
              mb={{ sm: "24px", md: "0px" }}
            >
              Showing {pageSize * pageIndex + 1} to{" "}
              {pageSize * (pageIndex + 1) <= tableData.length
                ? pageSize * (pageIndex + 1)
                : tableData.length}{" "}
              of {tableData.length} entries
            </Text>
            <Stack direction="row" alignSelf="flex-end" spacing="4px" ms="auto">
              <Button
                variant="no-hover"
                onClick={() => previousPage()}
                transition="all .5s ease"
                w="40px"
                h="40px"
                borderRadius="50%"
                bg="#fff"
                border="1px solid lightgray"
                display={
                  pageSize === 5 ? "none" : canPreviousPage ? "flex" : "none"
                }
                color="gray.400"
                _hover={{
                  bg: "red.400",
                  opacity: "0.7",
                  color: "#fff",
                }}
              >
                <Icon as={IoChevronBackOutline} w="16px" h="16px" />
              </Button>
              {pageSize === 5 ? (
                <NumberInput
                  max={pageCount - 1}
                  min={1}
                  w="75px"
                  mx="6px"
                  defaultValue="1"
                  onChange={(e) => gotoPage(e)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper onClick={() => nextPage()} />
                    <NumberDecrementStepper onClick={() => previousPage()} />
                  </NumberInputStepper>
                </NumberInput>
              ) : (
                createPages(pageCount).map((pageNumber) => {
                  return (
                    <Button
                      key={pageNumber}
                      variant="no-hover"
                      transition="all .5s ease"
                      onClick={() => gotoPage(pageNumber - 1)}
                      w="40px"
                      h="40px"
                      borderRadius="160px"
                      bg={pageNumber === pageIndex + 1 ? "red.400" : "#fff"}
                      border="1px solid lightgray"
                      color={pageNumber === pageIndex + 1 ? "#fff" : "gray.600"}
                      _hover={{
                        bg: "red.400",
                        opacity: "0.7",
                        color: "#fff",
                      }}
                    >
                      <Text fontSize="xs">{pageNumber}</Text>
                    </Button>
                  );
                })
              )}
              <Button
                variant="no-hover"
                onClick={() => nextPage()}
                transition="all .5s ease"
                w="40px"
                h="40px"
                borderRadius="160px"
                bg="#fff"
                border="1px solid lightgray"
                display={
                  pageSize === 5 ? "none" : canNextPage ? "flex" : "none"
                }
                color="gray.400"
                _hover={{
                  bg: "red.400",
                  opacity: "0.7",
                  color: "#fff",
                }}
              >
                <Icon as={IoChevronForwardOutline} w="16px" h="16px" />
              </Button>
            </Stack>
          </Flex>
        </CardBody>
      </Flex>
    </Card>
  );
}

export default DynamicTable;
