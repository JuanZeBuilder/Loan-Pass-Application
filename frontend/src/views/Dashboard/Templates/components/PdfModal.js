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
import { PdfIcon } from "components/Icons/Icons";

function PdfModal({ template }) {
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
        <PdfIcon w="28px" h="28px" />
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
          <ModalHeader>Authorization Letter Template</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              mb={4}
              mx={4}
              dangerouslySetInnerHTML={{ __html: template }}
            ></Box>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default PdfModal;
