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

function ActivateModal(props) {
  const { id, active, refresh } = props;

  const modalSize = "lg";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const updateStatus = () => {
    setIsLoading(true);

    const payload = {
      id: id,
    };

    if (active) {
      AdminService.updatePassStatusToInactive(payload).then(
        (response) => {
          setIsLoading(false);
          refresh();
          toast({
            position: "top",
            status: "success",
            isClosable: true,
            title: "Pass Update",
            description: `Pass ${id} has been ${
              active ? "Activated" : "Deactivated"
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
    } else {
      AdminService.updatePassStatusToActive(payload).then(
        (response) => {
          setIsLoading(false);
          refresh();
          toast({
            position: "top",
            status: "success",
            isClosable: true,
            title: "Pass Update",
            description: `Pass ${id} has been ${
              active ? "Activated" : "Deactivated"
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
    }

    onClose();
  };

  return (
    <Flex>
      <Button
        color={active ? "red.500" : "green.500"}
        variant="unstyled"
        minWidth="auto"
        ref={finalRef}
        onClick={onOpen}
        _hover={active ? { color: "red.300" } : { color: "green.300" }}
        me={2}
      >
        {active ? "Deactivate" : "Activate"}
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
            {active ? "Deactivate" : "Activate"} Pass {id}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Are you sure you want to {active ? "deactivate" : "activate"} Pass{" "}
              {id}?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} ref={initialRef} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme={active ? "red" : "green"}
              onClick={updateStatus}
              isLoading={isLoading}
            >
              {active ? "Deactivate" : "Activate"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default ActivateModal;
