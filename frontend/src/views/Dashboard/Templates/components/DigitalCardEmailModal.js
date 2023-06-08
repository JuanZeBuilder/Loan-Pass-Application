// General imports
import React, { useState, useRef } from "react";

// Chakra imports
import {
  Box,
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
import { useDisclosure } from "@chakra-ui/react";

// Custom components
import { MailIcon } from "components/Icons/Icons";

function DigitalCardEmailModal({ template }) {
  const modalSize = "full";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "outside";

  return (
    <Flex>
      <Button
        variant="unstyled"
        minWidth="auto"
        ref={finalRef}
        onClick={onOpen}
        me={5}
        _hover={{ color: "gray.400" }}
        color="gray.500"
      >
        <MailIcon w="28px" h="28px" />
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
        <ModalContent p={3}>
          <ModalHeader>ePass Email Template</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mx={4} dangerouslySetInnerHTML={{ __html: template }}></Box>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default DigitalCardEmailModal;
