// General imports
import React, { useState, useEffect } from "react";
import { usersData } from "variables/general";

import AdminService from "../../../services/admin.service.js";

// Chakra imports
import { Button, Flex, Tag, TagLabel, Text, Spinner } from "@chakra-ui/react";

// Custom components
import DynamicTable from "components/Tables/DynamicTable.js";
import ClearModal from "./components/ClearModal.js";

function OutstandingFees() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const refreshData = () => {
    setRefresh(refresh + 1);
  };

  const columnsData = [
    {
      Header: "Place of Interest",
      Cell: ({ row }) => (
        <Text minWidth="100%">{row.original.corpass.attraction}</Text>
      ),
    },
    {
      Header: "Pass Id",
      accessor: "corporatePassId",
      Cell: ({ row }) => (
        <Text minWidth="100%">{row.original.corporatePassId}</Text>
      ),
    },
    {
      Header: "Replacement Fee",
      accessor: "amount",
      Cell: ({ row }) => (
        <Text minWidth="100%">${row.original.amount.toFixed(2)}</Text>
      ),
    },
    {
      Header: "Email",
      accessor: "username",
      Cell: ({ row }) => <Text minWidth="100%">{row.original.username}</Text>,
    },
    {
      Header: "Date Reported",
      accessor: "dateReportLost",
      Cell: ({ row }) => (
        <Text minWidth="100%">
          {new Date(row.original.dateReportLost).toLocaleDateString()}
        </Text>
      ),
    },
    {
      Header: "Date Cleared",
      accessor: "dateCleared",
      Cell: ({ row }) => (
        <Text minWidth="100%">
          {!row.original.dateCleared
            ? "-"
            : new Date(row.original.dateCleared).toLocaleDateString()}
        </Text>
      ),
    },
    {
      Header: "ACTIONS",
      disableSortBy: true,
      Cell: ({ row }) => (
        <Flex>
          <ClearModal
            outstandingfeeID={row.original.outstandingfeeID}
            passID={row.original.corporatePassId}
            username={row.original.username}
            amount={row.original.amount}
            refresh={refreshData}
          />
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    fetchLostPasses();
  }, [refresh]);

  const fetchLostPasses = () => {
    AdminService.getLostPasses().then(
      (response) => {
        const filteredData = response.data.data.filter((response) => {
          return !response.dateCleared;
        });
        setContent(filteredData);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setIsError(true);

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
          title="Outstanding Fees Table"
          tableData={content}
          columnsData={columnsData}
        />
      )}
    </Flex>
  );
}

export default OutstandingFees;
