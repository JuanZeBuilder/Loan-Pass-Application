// General imports
import React, { useEffect, useState, useRef } from "react";

import UserService from "../../../../services/user.service.js";

// Chakra imports
import { useDisclosure } from "@chakra-ui/react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Grid,
  MenuItem,
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

function LoanInfoModal(props) {
  const { id } = props;

  const modalSize = "xl";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [content, setContent] = useState([]);

  useEffect(() => {
    previousBorrower();
  }, [id]);

  const previousBorrower = () => {
    setIsLoading(true);

    UserService.getPreviousBorrower(id).then(
      (response) => {
        setContent(response.data.data);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setIsError(true);

        console.log(error);
      }
    );
  };

  return (
    <Flex>
      <MenuItem ref={finalRef} onClick={onOpen}>
        View Previous Borrowers
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
          <ModalHeader>Previous Borrowers</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {Object.keys(content).map((prevPassInfo, index) => {
              return (
                <Grid key={index} templateColumns="1fr 1fr 1fr" gap={5} mb={4}>
                  <FormControl>
                    <FormLabel>Pass {index + 1}</FormLabel>
                    <Input type="text" value={prevPassInfo} isReadOnly={true} />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Borrower</FormLabel>
                    <Input
                      type="text"
                      value={
                        !content[prevPassInfo]
                          ? "No Borrower"
                          : content[prevPassInfo][0]
                      }
                      isReadOnly={true}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Contact No</FormLabel>
                    <Input
                      type="text"
                      value={
                        !content[prevPassInfo]
                          ? "No Contact Number"
                          : content[prevPassInfo][2]
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

export default LoanInfoModal;
