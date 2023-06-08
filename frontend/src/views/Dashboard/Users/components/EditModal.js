// General imports
import React, { useState, useRef } from "react";

import AdminService from "../../../../services/admin.service.js";

// Chakra imports
import { Box, useToast, useDisclosure } from "@chakra-ui/react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
} from "@chakra-ui/react";

// Custom components

function EditModal(props) {
  const { currentUser, name, username, isActive, refresh } = props;

  const modalSize = "xl";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const handleRole = (e) => setRole(e.target.value);

  const updateRole = () => {
    setIsLoading(true);

    let roles;

    // switch (role) {
    //   case "Borrower":
    //     roles = ["ROLE_BORROWER"];
    //     break;
    //   case "GOP":
    //     roles = ["ROLE_GOP", "ROLE_BORROWER"];
    //     break;
    //   case "Admin":
    //     roles = ["ROLE_BORROWER", "ROLE_GOP", "ROLE_ADMIN"];
    //     break;
    // }

    switch (role) {
      case "Borrower":
        roles = ["borrower"];
        break;
      case "GOP":
        roles = ["gop", "borrower"];
        break;
      case "Admin":
        roles = ["admin", "gop", "borrower"];
        break;
    }

    AdminService.updateUserRole(username, roles).then(
      (response) => {
        setIsLoading(false);
        refresh();
        toast({
          position: "top",
          status: "success",
          isClosable: true,
          title: "Role Update",
          description: `${name} role has been updated to ${role}.`,
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
        color="gray.500"
        variant="unstyled"
        minWidth="auto"
        me={2}
        ref={finalRef}
        onClick={onOpen}
        // disabled={!isActive}
        _hover={currentUser !== username ? { color: "gray.400" } : ""}
        disabled={currentUser == username}
      >
        Edit
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
          <ModalHeader>Edit {name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4}>
              <FormLabel>Role</FormLabel>
              <Select onChange={handleRole} placeholder="Select role">
                <option value="Borrower">Borrower</option>
                <option value="Admin">Admin</option>
                <option value="GOP">GOP</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} ref={initialRef} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={updateRole}
              isLoading={isLoading}
              disabled={!role}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default EditModal;
