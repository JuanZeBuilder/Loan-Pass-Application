// General imports
import React, { useState, useRef } from "react";
import "../styles/style.css";

import AdminService from "../../../../services/admin.service.js";

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
  useToast,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

// Custom components
import ReactQuill from "react-quill";

function EditModal({ header, type, template, refresh }) {
  const modalSize = "xl";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "outside";

  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState(
    /<body.*?>([\s\S]*)<\/body>/.exec(template)[1]
  );

  const toolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    ["bold", "italic", "underline", "strike"],

    [{ color: [] }, { background: [] }],

    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],

    [{ align: [] }],

    ["link", "image"],

    ["clean"],
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  const toast = useToast();

  const editTemplate = () => {
    setIsLoading(true);

    const doc = new DOMParser().parseFromString(template, "text/html");
    doc.getElementsByTagName("body")[0].innerHTML = value;
    const body = "<!DOCTYPE HTML>" + "\n" + doc.documentElement.outerHTML;

    AdminService.editTemplate(type, body).then(
      (response) => {
        setIsLoading(false);
        refresh();
        toast({
          position: "top",
          status: "success",
          isClosable: true,
          title: "Template Update",
          description: `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } Template has been updated.`,
        });
      },
      (error) => {
        setIsLoading(false);
        toast({
          position: "top",
          status: "error",
          isClosable: true,
          title: "Error Occured",
          description: error.message,
        });
      }
    );

    onClose();
  };

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
        Edit
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
          <ModalHeader>{header} Template</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb={4}>
              <ReactQuill value={value} modules={modules} onChange={setValue} />
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} ref={initialRef} mr={3}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              isLoading={isLoading}
              onClick={editTemplate}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default EditModal;
