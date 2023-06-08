// General imports
import React, { useState, useRef } from "react";

// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormLabel,
  FormControl,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

// Custom components

function AppendixModal({ parameters }) {
  const modalSize = "xl";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

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
        Appendix
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
          <ModalHeader>Template Parameters</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              {Object.keys(parameters).map((parameterKey) => {
                return (
                  <FormControl mb={4} key={parameterKey}>
                    <FormLabel>{parameterKey}</FormLabel>
                    <Input
                      type="text"
                      value={parameters[parameterKey]}
                      isReadOnly={true}
                    />
                  </FormControl>
                );
              })}
            </Box>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default AppendixModal;
