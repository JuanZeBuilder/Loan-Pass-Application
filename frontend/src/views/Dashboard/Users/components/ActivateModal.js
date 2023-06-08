// General imports
import React, { useState, useRef } from "react";

import AdminService from "../../../../services/admin.service.js";

// Chakra imports
import { useToast, useDisclosure } from "@chakra-ui/react";
import {
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";

// Custom components

function ActivateModal(props) {
  const { currentUser, name, username, isActive, refresh } = props;

  const modalSize = "lg";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const updateStatus = () => {
    let enabled = isActive ? false : true;
    setIsLoading(true);

    AdminService.updateUserStatus(username, enabled).then(
      (response) => {
        setIsLoading(false);
        refresh();
        toast({
          position: "top",
          status: "success",
          isClosable: true,
          title: "Status Update",
          description: `${name} has been ${
            isActive ? "Activated" : "Deactivated"
          }.`,
        });
      },
      (error) => {
        setIsLoading(false);

        toast({
          position: "top",
          status: "error",
          isClosable: true,
          title: "Error Occured",
          description: error.response
            ? error.response.data.message
            : error.message,
        });
      }
    );

    onClose();
  };

  return (
    <Flex>
      <Button
        color={isActive ? "red.500" : "green.500"}
        variant="unstyled"
        minWidth="auto"
        ref={finalRef}
        onClick={onOpen}
        _hover={
          currentUser !== username
            ? isActive
              ? { color: "red.300" }
              : { color: "green.300" }
            : ""
        }
        disabled={currentUser == username}
      >
        {isActive ? "Deactivate" : "Activate"}
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        scrollBehavior={scrollBehavior}
        closeOnOverlayClick={true}
        isOpen={isOpen}
        onClose={onClose}
        size={modalSize}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isActive ? "Deactivate" : "Activate"} {name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Are you sure you want to {isActive ? "deactivate" : "activate"}{" "}
              {name} account?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} ref={initialRef} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme={isActive ? "red" : "green"}
              onClick={updateStatus}
              isLoading={isLoading}
            >
              {isActive ? "Deactivate" : "Activate"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default ActivateModal;
