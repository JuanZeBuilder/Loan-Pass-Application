// General imports
import React, { useState, useRef } from "react";

import UserService from "../../../../services/user.service.js";

// Chakra imports
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Select,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";

// Custom components

function ReportModal(props) {
  const { id, passes, refresh } = props;

  const modalSize = "xl";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  const physicalPasses = passes.filter(
    (pass) => pass.type != "electronic" && pass.status != "lost"
  );

  const [lostPass, setLostPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  const handleLostPass = (e) => setLostPass(e.target.value);

  const reportLostPass = () => {
    setIsLoading(true);

    const payload = {
      corporatePassId: lostPass,
      loanId: id,
    };

    UserService.createLostPass(payload).then(
      (response) => {
        setIsLoading(false);
        refresh();
        toast({
          position: "top",
          status: "success",
          isClosable: true,
          title: "Lost Pass Report Created",
          description: `Pass ${lostPass} has been reported as lost.`,
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
      <MenuItem ref={finalRef} onClick={onOpen}>
        Report Lost Pass
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
          <ModalHeader>Report Lost Pass</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl mb={4}>
              <FormLabel>Pass Number</FormLabel>
              <Select
                onChange={handleLostPass}
                placeholder="Select pass number"
              >
                {physicalPasses.map((pass, index) => (
                  <option key={pass.barcodeId} value={pass.barcodeId}>
                    {pass.barcodeId}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} ref={initialRef} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={reportLostPass}
              isLoading={isLoading}
              disabled={!lostPass}
            >
              Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default ReportModal;
