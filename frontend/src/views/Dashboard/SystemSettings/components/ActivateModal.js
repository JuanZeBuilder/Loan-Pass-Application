// General imports
import React, { useRef } from "react";

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
} from "@chakra-ui/react";

// Custom components

function ActivateModal(props) {
  const { name, isActive } = props;

  const modalSize = "lg";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  return (
    <Flex>
      <Button
        color={isActive ? "red.500" : "green.500"}
        variant="unstyled"
        minWidth="auto"
        ref={finalRef}
        onClick={onOpen}
        _hover={isActive ? { color: "red.300" } : { color: "green.300" }}
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
            Are you sure you want to {isActive ? "deactivate" : "activate"}{" "}
            {name} account?
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} ref={initialRef} mr={3}>
              Cancel
            </Button>
            <Button colorScheme={isActive ? "red" : "green"}>
              {isActive ? "Deactivate" : "Activate"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default ActivateModal;
