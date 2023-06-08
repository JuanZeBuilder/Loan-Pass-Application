// General imports
import React, { useState, useEffect } from "react";
import { usersData } from "variables/general";
import { useSelector } from "react-redux";

import AdminService from "../../../services/admin.service.js";

// Chakra imports
import { Button, Flex, Tag, TagLabel, Text, Spinner } from "@chakra-ui/react";

// Custom components
import DynamicTable from "components/Tables/DynamicTable.js";
import EditModal from "./components/EditModal.js";
import ActivateModal from "./components/ActivateModal.js";
import ErrorMessage from "components/UI/ErrorMessage.js";

function Users() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const refreshData = () => {
    setRefresh(refresh + 1);
  };

  const { user: currentUser } = useSelector((state) => state.auth);

  const formatContactNo = (value, format) => {
    let i = 0;
    let contact = value;

    if (contact) {
      return format.replace(/#/g, (_) => contact[i++]);
    }

    return "-";
  };

  const formatRole = (roles) => {
    let role = "Borrower";

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name == "ROLE_GOP") {
        role = "GOP";
      }

      if (roles[i].name == "ROLE_ADMIN") {
        return "Admin";
      }
    }
    return role;
  };

  const columnsData = [
    {
      Header: "NAME",
      accessor: "name",
      Cell: ({ row }) => <Text minWidth="100%">{row.original.name}</Text>,
    },
    {
      Header: "EMAIL",
      accessor: "username",
      Cell: ({ row }) => <Text minWidth="100%">{row.original.username}</Text>,
    },
    {
      Header: "CONTACT",
      accessor: "contactNumber",
      Cell: ({ row }) => (
        <Text minWidth="100%">
          {formatContactNo(row.original.contactNumber, "#### ####")}
        </Text>
      ),
    },
    {
      Header: "ROLE",
      accessor: "roles",
      Cell: ({ row }) => (
        <Text minWidth="100%">{formatRole(row.original.roles)}</Text>
      ),
    },
    {
      Header: "STATUS",
      accessor: "enabled",
      Cell: ({ row }) => (
        <Tag
          size="md"
          variant="solid"
          colorScheme={row.original.enabled ? "green" : "red"}
        >
          <TagLabel>{row.original.enabled ? "Active" : "Disabled"}</TagLabel>
        </Tag>
      ),
    },
    {
      Header: "ACTIONS",
      disableSortBy: true,
      Cell: ({ row }) => (
        <Flex>
          <EditModal
            currentUser={currentUser.username}
            name={row.original.name}
            username={row.original.username}
            isActive={row.original.enabled}
            refresh={refreshData}
          />
          <ActivateModal
            currentUser={currentUser.username}
            name={row.original.name}
            username={row.original.username}
            isActive={row.original.enabled}
            refresh={refreshData}
          />
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const fetchUsers = () => {
    AdminService.getUsers().then(
      (response) => {
        const filteredData = response.data.data.map((item) => {
          return {
            ...item,
            name: `${
              item.firstName.charAt(0).toUpperCase() + item.firstName.slice(1)
            } ${
              item.lastName.charAt(0).toUpperCase() + item.lastName.slice(1)
            }`,
          };
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
          title="User Info Table"
          tableData={content}
          columnsData={columnsData}
        />
      )}
    </Flex>
  );
}

export default Users;
