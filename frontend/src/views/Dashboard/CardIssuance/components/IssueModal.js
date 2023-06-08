// General imports
import React, { useState, useRef } from "react";

import GOPService from "../../../../services/gop.service.js";

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
  UnorderedList,
  List,
  ListItem,
  useToast,
} from "@chakra-ui/react";

// Custom components

function IssueModal(props) {
  const { loanID, name, status, passes, refresh } = props;

  const modalSize = "lg";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const physicalPasses = passes.filter((pass) => pass.type != "electronic");

  const changeLoanStatus = async () => {
    setIsLoading(true);

    let loanStatus = status == "issued" ? "Returned" : "Issued";
    let toastTitle = status == "issued" ? "Passes Returned" : "Passes Issued";
    let toastDescription =
      status == "issued"
        ? `${name} has returned the Passes.`
        : `Passes has been issued to ${name}.`;

    if (status == "issued") {
      GOPService.returnPasses(loanID).then(
        (response) => {
          setIsLoading(false);
          refresh();
          toast({
            position: "top",
            status: "success",
            isClosable: true,
            title: toastTitle,
            description: toastDescription,
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

    if (status == "pending") {
      GOPService.issuePasses(loanID).then(
        (response) => {
          setIsLoading(false);
          refresh();
          toast({
            position: "top",
            status: "success",
            isClosable: true,
            title: toastTitle,
            description: toastDescription,
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
        color="gray.500"
        variant="unstyled"
        minWidth="auto"
        me={2}
        ref={finalRef}
        onClick={onOpen}
      >
        {status == "issued" ? "Return" : "Issue"}
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
            {status == "issued" ? "Return" : "Issue"} Passes
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {status == "issued" ? (
              <Text mb={4}>
                Have <Text as="strong">{name}</Text> returned the following
                passes?
              </Text>
            ) : (
              <Text mb={4}>
                Have you issued <Text as="strong">{name}</Text> the following
                passes?
              </Text>
            )}
            <UnorderedList listStyleType="none">
              {physicalPasses.map((pass, index) => {
                return (
                  <ListItem
                    key={index}
                    justifyContent="center"
                    alignItems="center"
                    mb={1}
                  >
                    Pass {index + 1}: {pass.barcodeId}
                  </ListItem>
                );
              })}
            </UnorderedList>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} ref={initialRef} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={changeLoanStatus}
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

export default IssueModal;
