// General imports
import React, { useState, useRef } from "react";

import AdminService from "../../../../services/admin.service.js";

// Chakra imports
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
  useToast,
  useDisclosure,
} from "@chakra-ui/react";

// Custom components

function DeleteModal(props) {
  const { id, passNumber, refresh } = props;

  const modalSize = "lg";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const removePass = () => {
    setIsLoading(true);

    AdminService.deletePass(id).then(
      (response) => {
        setIsLoading(false);
        refresh();
        toast({
          position: "top",
          status: "success",
          isClosable: true,
          title: "Pass Deleted",
          description: `Pass ${passNumber} has been deleted.`,
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
        color="red.500"
        variant="unstyled"
        minWidth="auto"
        ref={finalRef}
        onClick={onOpen}
        _hover={{ color: "red.300" }}
      >
        Delete
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
          <ModalHeader>Delete Pass</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Are you sure you want to delete Pass {passNumber}?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} ref={initialRef} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={removePass}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default DeleteModal;
