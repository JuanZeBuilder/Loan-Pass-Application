// General imports
import React, { useState, useRef } from "react";

import AdminService from "../../../../services/admin.service.js";

// Chakra imports
import { useDisclosure } from "@chakra-ui/react";
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
} from "@chakra-ui/react";

// Custom components

function ClearModal(props) {
  const { outstandingfeeID, passID, username, amount, refresh } = props;

  const modalSize = "lg";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const clearPass = () => {
    setIsLoading(true);

    AdminService.clearLostPassAmount(outstandingfeeID, amount).then(
      (response) => {},
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

    AdminService.clearLostPass(outstandingfeeID).then(
      (response) => {
        setIsLoading(false);
        refresh();
        toast({
          position: "top",
          status: "success",
          isClosable: true,
          title: "Outstanding Fee Cleared",
          description: `${username} has cleared the outstanding fee.`,
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
        ref={finalRef}
        onClick={onOpen}
        _hover={{ color: "gray.400" }}
      >
        Clear
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
          <ModalHeader>Clear Outstanding Fee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Have <Text as="strong">{username}</Text> paid the outstanding fee
              of ${amount.toFixed(2)}?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} ref={initialRef} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={clearPass}
              isLoading={isLoading}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default ClearModal;
