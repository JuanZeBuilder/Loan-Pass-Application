// General imports
import React, { useEffect, useState } from "react";
import { issuanceData } from "variables/general";

import GOPService from "../../../services/gop.service.js";

// Chakra imports
import { Button, Flex, Tag, TagLabel, Text } from "@chakra-ui/react";

// Custom components
import DynamicTable from "components/Tables/DynamicTable.js";
import ActivateModal from "./components/ActivateModal.js";
import PreviewModal from "./components/PreviewModal.js";
import IssueModal from "./components/IssueModal.js";

function CardIssuance() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const refreshData = () => {
    setRefresh(refresh + 1);
  };

  useEffect(() => {
    fetchLoans();
  }, [refresh]);

  const fetchLoans = () => {
    setIsLoading(true);

    GOPService.getLoans().then(
      (response) => {
        const filteredData = response.data.data
          .filter((response) => {
            return (
              response.status != "returned" &&
              response.status != "approved" &&
              response.status != "cancelled"
            );
          })
          .sort(function compare(a, b) {
            let dateA = new Date(a.loanPassDate);
            let dateB = new Date(b.loanPassDate);

            return dateB - dateA;
          });
        setContent(filteredData);
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

  const formatContactNo = (value, format) => {
    let i = 0;
    let contact = value.toString();
    return format.replace(/#/g, (_) => contact[i++]);
  };

  const columnsData = [
    {
      Header: "LOAN ID",
      accessor: "loanID",
      Cell: ({ row }) => <Text minWidth="100%">{row.original.loanID}</Text>,
    },
    {
      Header: "EMAIL",
      accessor: "email",
      Cell: ({ row }) => <Text minWidth="100%">{row.original.email}</Text>,
    },
    {
      Header: "PLACE OF INTEREST",
      accessor: "attraction",
      Cell: ({ row }) => <Text minWidth="100%">{row.original.attraction}</Text>,
    },
    {
      Header: "NO. OF PASS",
      accessor: "numberOfPassesNeeded",
      Cell: ({ row }) => (
        <Flex>
          <PreviewModal passes={row.original.corppassList} />
        </Flex>
      ),
    },
    {
      Header: "BOOKING DATE",
      accessor: "loanPassDate",
      Cell: ({ row }) => (
        <Text minWidth="100%">
          {row.original.loanPassDate.split("-").reverse().join("/")}
        </Text>
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
          {row.original.status === "pending" ||
          row.original.status === "issued" ? (
            <IssueModal
              loanID={row.original.loanID}
              name={row.original.username}
              status={row.original.status}
              passes={row.original.corppassList}
              refresh={refreshData}
            />
          ) : (
            ""
          )}
        </Flex>
      ),
    },
  ];

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <DynamicTable
        title="Card Issuance Table"
        tableData={content}
        columnsData={columnsData}
      />
    </Flex>
  );
}

export default CardIssuance;
