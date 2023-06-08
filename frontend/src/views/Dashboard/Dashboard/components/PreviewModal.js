// General imports
import React, { useState, useRef } from "react";

// Chakra imports
import { useDisclosure } from "@chakra-ui/react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  MenuItem,
  Grid,
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

// Custom components

function PreviewModal(props) {
  const { noOfPasses, passes } = props;

  const modalSize = "xl";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  return (
    <Flex>
      <MenuItem ref={finalRef} onClick={onOpen}>
        View Passes
      </MenuItem>

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
          <ModalHeader>Passes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {passes.map((pass, index) => {
              return (
                <Grid key={index} templateColumns="1.2fr 0.8fr" gap={5} mb={4}>
                  <FormControl>
                    <FormLabel>Pass {index + 1}</FormLabel>
                    <Input
                      type="text"
                      value={pass.barcodeId}
                      isReadOnly={true}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Input
                      type="text"
                      value={
                        pass.type.charAt(0).toUpperCase() + pass.type.slice(1)
                      }
                      isReadOnly={true}
                    />
                  </FormControl>
                </Grid>
              );
            })}
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default PreviewModal;
