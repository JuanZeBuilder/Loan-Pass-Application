// General imports
import React, { useState, useEffect } from "react";
import { corporatePassData } from "variables/general";

import AdminService from "../../../services/admin.service.js";

// Chakra imports
import {
  Avatar,
  Button,
  Box,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
  Tag,
  TagLabel,
  Text,
  Spinner,
} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import DynamicTable from "components/Tables/DynamicTable.js";
import CreateModal from "./components/CreateModal.js";
import ActivateModal from "./components/ActivateModal.js";
import DeleteModal from "./components/DeleteModal.js";
import ErrorMessage from "components/UI/ErrorMessage.js";

function CorporatePasses() {
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState("");
  const [memberships, setMemberships] = useState([]);
  const [membershipDetails, setMembershipDetails] = useState({});
  const [refresh, setRefresh] = useState(0);

  const handleMembership = (e) => {
    setSelectedMembership(e.target.value);
    fetchPasses(e.target.value);
  };

  const refreshData = () => {
    setRefresh(refresh + 1);
  };

  const columnsData = [
    {
      Header: "PLACE OF INTEREST",
      accessor: "attraction",
      Cell: ({ row }) => <Text minWidth="100%">{row.original.attraction}</Text>,
    },
    {
      Header: "Pass Number",
      accessor: "barcodeId",
      Cell: ({ row }) => <Text minWidth="100%">{row.original.barcodeId}</Text>,
    },
    {
      Header: "Type",
      accessor: "type",
      Cell: ({ row }) => (
        <Text minWidth="100%">
          {row.original.type.charAt(0).toUpperCase() +
            row.original.type.slice(1)}
        </Text>
      ),
    },
    {
      Header: "Pass Status",
      accessor: "status",
      Cell: ({ row }) => (
        <Text minWidth="100%">
          {row.original.status.charAt(0).toUpperCase() +
            row.original.status.slice(1)}
        </Text>
      ),
    },
    {
      Header: "Active",
      accessor: "active",
      Cell: ({ row }) => (
        <Tag
          size="md"
          variant="solid"
          colorScheme={row.original.active ? "green" : "red"}
        >
          <TagLabel>{row.original.active ? "Active" : "Inactive"}</TagLabel>
        </Tag>
      ),
    },
    {
      Header: "ACTIONS",
      disableSortBy: true,
      Cell: ({ row }) => (
        <Flex>
          <ActivateModal
            id={row.original.id}
            active={row.original.active}
            refresh={refreshData}
          />
          {/* <DeleteModal
            id={row.original.id}
            passNumber={row.original.barcodeId}
            refresh={refreshData}
          /> */}
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    fetchMemberships();
    fetchPasses(selectedMembership);
  }, [refresh]);

  const fetchMemberships = () => {
    AdminService.getCorporateMemberships().then(
      (response) => {
        const membershipsList = _(response.data.data)
          .groupBy((item) => item.membershipName)
          .map((value, key) => {
            return key;
          })
          .value();

        let memberships = [];

        for (let i = 0; i < membershipsList.length; i++) {
          memberships.push(
            <option key={i} value={membershipsList[i]}>
              {membershipsList[i]}
            </option>
          );
        }

        setMemberships(memberships);
      },
      (error) => {
        setIsError(true);

        console.log(error);
      }
    );
  };

  const fetchPasses = (membership) => {
    if (!membership) {
      setContent([]);
      return;
    }

    AdminService.getCorporatePasses(membership).then(
      (response) => {
        setContent(response.data.data);

        const tempPass = response.data.data;

        let physicalPass = response.data.data.findIndex((el) =>
          el.type.includes("physical")
        );
        physicalPass === -1 ? (physicalPass = 0) : physicalPass;

        setMembershipDetails({
          membershipName: tempPass[physicalPass].membershipName,
          membershipType: tempPass[physicalPass].membershipType,
          attraction: tempPass[physicalPass].attraction,
          address: tempPass[physicalPass].address,
          postalCode: tempPass[physicalPass].postalCode,
          replacementFee: tempPass[physicalPass].replacementFee,
          active: tempPass[physicalPass].active,
        });
      },
      (error) => {
        setContent([]);

        console.log(error);
      }
    );
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      <Box>
        <Flex mb="25px">
          <Card>
            <Flex direction="column">
              <CardHeader py="12px" mb="5px" justifyContent="space-between">
                <Text fontSize="xl" fontWeight="bold">
                  Corporate Membership
                </Text>
              </CardHeader>
              <CardBody>
                <FormControl mb={4}>
                  <Select
                    onChange={handleMembership}
                    placeholder="Select corporate membership"
                  >
                    {memberships}
                  </Select>
                </FormControl>
              </CardBody>
            </Flex>
          </Card>
        </Flex>

        <DynamicTable
          title="Corporate Passes Table"
          createItem={
            selectedMembership ? (
              <CreateModal
                refresh={refreshData}
                membershipDetails={membershipDetails}
              />
            ) : (
              ""
            )
          }
          tableData={content}
          columnsData={columnsData}
        />
      </Box>
    </Flex>
  );
}

export default CorporatePasses;
