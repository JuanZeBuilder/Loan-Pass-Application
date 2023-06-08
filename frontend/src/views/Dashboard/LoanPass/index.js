// General imports
import React, { useEffect, useState } from "react";
import { loanHistoryData } from "variables/general";

import UserService from "../../../services/user.service.js";

// Chakra imports
import { Button, Flex, Tag, TagLabel, Text, Spinner } from "@chakra-ui/react";

// Custom components
import DynamicTable from "components/Tables/DynamicTable.js";
import CreateModal from "./components/CreateModal.js";
import PreviewModal from "./components/PreviewModal.js";
import CancelModal from "./components/CancelModal.js";
import ErrorMessage from "components/UI/ErrorMessage.js";

function Loans() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const refreshData = () => {
    setRefresh(refresh + 1);
  };

  const columnsData = [
    {
      Header: "LOAN ID",
      accessor: "loanID",
      Cell: ({ row }) => <Text>{row.original.loanID}</Text>,
    },
    {
      Header: "PLACE OF INTEREST",
      accessor: "attraction",
      Cell: ({ row }) => <Text>{row.original.attraction}</Text>,
    },
    {
      Header: "NO. OF PASS",
      accessor: "numberOfPassesNeeded",
      Cell: ({ row }) => (
        <Flex>
          <PreviewModal
            noOfPasses={row.original.numberOfPassesNeeded}
            passes={row.original.corppassList}
          />
        </Flex>
      ),
    },
    {
      Header: "BORROW DATE",
      accessor: "borrowDate",
      Cell: ({ row }) => (
        <Text>{new Date(row.original.borrowDate).toLocaleDateString()}</Text>
      ),
    },
    {
      Header: "BOOKING DATE",
      accessor: "loanPassDate",
      Cell: ({ row }) => (
        <Text>{row.original.loanPassDate.split("-").reverse().join("/")}</Text>
        // <Text>{row.original.loanPassDate}</Text>
      ),
    },
    {
      Header: "STATUS",
      accessor: "status",
      Cell: ({ row }) =>
        row.original.status === "returned" || row.original.status === "lost" ? (
          <Tag
            size="md"
            variant="solid"
            colorScheme={row.original.status === "returned" ? "green" : "red"}
          >
            <TagLabel>
              {row.original.status.charAt(0).toUpperCase() +
                row.original.status.slice(1)}
            </TagLabel>
          </Tag>
        ) : (
          <Text>
            {row.original.status.charAt(0).toUpperCase() +
              row.original.status.slice(1)}
          </Text>
        ),
    },
    {
      Header: "ACTIONS",
      disableSortBy: true,
      Cell: ({ row }) => (
        <Flex>
          {row.original.status != "cancelled" &&
          row.original.status != "returned" &&
          row.original.status != "issued" &&
          row.original.status !== "lost" &&
          Math.ceil(
            Math.abs(new Date(row.original.loanPassDate) - new Date()) /
              (1000 * 60 * 60 * 24)
          ) > 1 ? (
            <CancelModal
              id={row.original.loanID}
              attraction={row.original.attraction}
              refresh={refreshData}
            />
          ) : (
            ""
          )}
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    fetchAttractions();
    fetchLoans();
  }, [refresh]);

  const fetchLoans = () => {
    UserService.getLoans().then(
      (response) => {
        const sortedData = response.data.data.sort(function compare(a, b) {
          let dateA = new Date(a.loanPassDate);
          let dateB = new Date(b.loanPassDate);

          return dateB - dateA;
        });

        setContent(sortedData);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setIsError(true);
        setContent([]);

        console.log(error);
      }
    );
  };

  const fetchAttractions = () => {
    UserService.getCorporatePasses().then(
      (response) => {
        const attractionsList = _(response.data.data)
          .groupBy((item) => item.membershipName)
          .map((value, key) => {
            return value[0].attraction;
          })
          .value();

        setAttractions(attractionsList);
      },
      (error) => {
        setContent([]);

        console.log(error);
      }
    );
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {isLoading ? (
        <Flex justifyContent="center" marginTop={5}>
          <Spinner color="red.500" size="xl" />
        </Flex>
      ) : (
        <DynamicTable
          title="Loan History Table"
          createItem={
            <CreateModal attractions={attractions} refresh={refreshData} />
          }
          tableData={content}
          columnsData={columnsData}
        />
      )}
    </Flex>
  );
}

export default Loans;
