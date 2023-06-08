// General imports
import React, { useState, useEffect } from "react";
import { usersData } from "variables/general";

import AdminService from "../../../services/admin.service.js";

// Chakra imports
import { Button, Flex, Tag, TagLabel, Text, Spinner } from "@chakra-ui/react";

// Custom components
import DynamicTable from "components/Tables/DynamicTable.js";
import EditModal from "./components/EditModal.js";

function SystemSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const refreshData = () => {
    setRefresh(refresh + 1);
  };

  const columnsData = [
    {
      Header: "Setting Name",
      accessor: "settingName",
      Cell: ({ row }) => (
        <Text minWidth="100%">
          {row.original.settingName
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </Text>
      ),
    },
    {
      Header: "Limit",
      accessor: "value",
    },
    {
      Header: "ACTIONS",
      disableSortBy: true,
      Cell: ({ row }) => (
        <Flex>
          <EditModal
            setting={row.original.settingName}
            settingName={row.original.settingName
              .replace(/([a-z])([A-Z])/g, "$1 $2")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
            value={row.original.value}
            refresh={refreshData}
          />
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    fetchSettings();
  }, [refresh]);

  const fetchSettings = () => {
    AdminService.getSystemSettings().then(
      (response) => {
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
          title="System Settings Table"
          tableData={content}
          columnsData={columnsData}
        />
      )}
    </Flex>
  );
}

export default SystemSettings;
