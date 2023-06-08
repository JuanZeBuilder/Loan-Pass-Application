// General imports
import React, { useState, useEffect } from "react";
import { corporatePassData } from "variables/general";

import AdminService from "../../../services/admin.service.js";

// Chakra imports
import { Avatar, Button, Flex, Text, Spinner } from "@chakra-ui/react";

// Custom components
import DynamicTable from "components/Tables/DynamicTable.js";
import CreateModal from "./components/CreateModal.js";
import EditModal from "./components/EditModal.js";
import ErrorMessage from "components/UI/ErrorMessage.js";

function CorporateMemberships() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState([]);
  const [combinedContent, setCombinedContent] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const refreshData = () => {
    setRefresh(refresh + 1);
  };

  const columnsData = [
    {
      Header: "MEMBERSHIP NAME",
      accessor: "membershipName",
      Cell: ({ row }) => (
        <Text minWidth="100%">{row.original.membershipName}</Text>
      ),
    },
    {
      Header: "PLACE OF INTEREST",
      accessor: "attraction",
      Cell: ({ row }) => <Text minWidth="100%">{row.original.attraction}</Text>,
    },
    {
      Header: "NO. OF PASS",
      Cell: ({ row }) => (
        <Text minWidth="100%">{row.original.passes.length} Passes</Text>
      ),
    },
    {
      Header: "REPLACEMENT FEE",
      accessor: "replacementFee",
      Cell: ({ row }) => (
        <Text minWidth="100%">${row.original.replacementFee.toFixed(2)}</Text>
      ),
    },
    {
      Header: "ACTIONS",
      disableSortBy: true,
      Cell: ({ row }) => (
        <Flex>
          <EditModal
            refresh={refreshData}
            prevMembershipName={row.original.membershipName}
            membershipName={row.original.membershipName}
            membershipType={row.original.membershipType}
            attraction={row.original.attraction}
            address={row.original.address}
            postalCode={row.original.postalCode.split(" ")[1]}
            replacementFee={row.original.replacementFee}
          />
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    fetchMemberships();
  }, [refresh]);

  const fetchMemberships = () => {
    AdminService.getCorporateMemberships().then(
      (response) => {
        const combinedData = _(response.data.data)
          .groupBy((item) => item.membershipName)
          .map((value, key) => {
            let physicalPass = value.findIndex((el) =>
              el.type.includes("physical")
            );
            physicalPass === -1 ? (physicalPass = 0) : physicalPass;
            return {
              membershipName: key,
              membershipType: value[0].membershipType,
              attraction: value[0].attraction,
              address: value[0].address,
              postalCode: value[0].postalCode,
              replacementFee: value[physicalPass].replacementFee,
              active: value[0].active,
              passes: value,
            };
          })
          .value();

        setCombinedContent(combinedData);
        setContent(response.data.data);
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
          title="Corporate Memberships Table"
          createItem={<CreateModal refresh={refreshData} />}
          tableData={combinedContent}
          columnsData={columnsData}
        />
      )}
    </Flex>
  );
}

export default CorporateMemberships;
