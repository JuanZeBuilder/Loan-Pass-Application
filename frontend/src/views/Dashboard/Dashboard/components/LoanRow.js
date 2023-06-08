// General imports
import React from "react";

import UserService from "../../../../services/user.service.js";

// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import { IoEllipsisVertical } from "react-icons/io5";
import LoanInfoModal from "./LoanInfoModal.js";
import PreviewModal from "./PreviewModal.js";
import CancelModal from "./CancelModal.js";
import ReportModal from "./ReportModal.js";

function LoanRow(props) {
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("#F8F9FA", "gray.800");
  const nameColor = useColorModeValue("gray.500", "white");
  const {
    id,
    attraction,
    noOfPass,
    loanPassDate,
    borrowDate,
    status,
    corppassList,
    refresh,
  } = props;

  const physicalPasses = corppassList.filter(
    (pass) => pass.type != "electronic" && pass.status != "lost"
  );

  return (
    <Box p="24px" bg={bgColor} my="22px" borderRadius="12px" key={id}>
      <Flex justify="space-between" w="100%">
        <Flex direction="column" maxWidth="70%">
          <Text color={nameColor} fontSize="md" fontWeight="bold" mb="10px">
            {attraction}
          </Text>
          <Text color="gray.400" fontSize="sm" fontWeight="semibold">
            No. of Pass:{" "}
            <Text as="span" color="gray.500">
              {noOfPass} Passes
            </Text>
          </Text>
          <Text color="gray.400" fontSize="sm" fontWeight="semibold">
            Booking Date:{" "}
            <Text as="span" color="gray.500">
              {loanPassDate.split("-").reverse().join("/")}
            </Text>
          </Text>
          {/* <Text color="gray.400" fontSize="sm" fontWeight="semibold">
            Borrow Date:{" "}
            <Text as="span" color="gray.500">
              {new Date(borrowDate).toLocaleDateString()}
            </Text>
          </Text> */}
          <Text color="gray.400" fontSize="sm" fontWeight="semibold">
            Status:{" "}
            <Text as="span" color="gray.500">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </Text>
        </Flex>
        <Flex direction={{ sm: "column", md: "column" }} alignItems="start">
          <Menu>
            <MenuButton as={Button} bg="transparent" color="gray.400">
              <IoEllipsisVertical size={20} />
            </MenuButton>
            <MenuList>
              <PreviewModal passes={corppassList} noOfPasses={noOfPass} />
              <LoanInfoModal id={id} />
              {status != "cancelled" &&
              status != "returned" &&
              status != "issued" &&
              status !== "lost" &&
              Math.ceil(
                Math.abs(new Date(loanPassDate) - new Date()) /
                  (1000 * 60 * 60 * 24)
              ) > 1 ? (
                <CancelModal
                  id={id}
                  attraction={attraction}
                  refresh={refresh}
                />
              ) : (
                ""
              )}
              {physicalPasses.length > 0 && status == "issued" ? (
                <ReportModal id={id} passes={corppassList} refresh={refresh} />
              ) : (
                ""
              )}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
}

export default LoanRow;
