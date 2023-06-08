// General imports
import React, { useState, useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AdminService from "../../../../services/admin.service.js";

// Chakra imports
import { useDisclosure } from "@chakra-ui/react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Grid,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  Stack,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components

function CreateModal({ refresh, membershipDetails }) {
  const modalSize = "xl";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const closeModal = () => {
    onClose();
  };

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  // Form
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  var initialValues = {
    type: "",
    passNumber: "",
  };

  const validationSchema = Yup.object().shape({
    type: Yup.string().required("Please select the pass type!"),
    passNumber: Yup.string().required("Please enter the pass number!"),
  });

  const createCorporatePass = (formValue) => {
    const { type, passNumber } = formValue;
    setIsLoading(true);

    const payload = {
      id: passNumber,
      barcodeId: passNumber,
      type: type,
      status: "available",
      ...membershipDetails,
    };

    AdminService.createPass(payload).then(
      (response) => {
        setIsLoading(false);
        refresh();
        toast({
          position: "top",
          status: "success",
          isClosable: true,
          title: "Corporate Pass Created",
          description: `Pass Number ${passNumber} has been created.`,
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
      <Button colorScheme="teal" size="sm" ref={finalRef} onClick={onOpen}>
        Create Pass
      </Button>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        scrollBehavior={scrollBehavior}
        closeOnOverlayClick={true}
        isOpen={isOpen}
        onClose={closeModal}
        size={modalSize}
      >
        <ModalOverlay />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={createCorporatePass}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form>
              <ModalContent>
                <ModalHeader>Create Pass</ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                  <Field name="type">
                    {({ field, form }) => (
                      <FormControl
                        mb={4}
                        isInvalid={errors.type && touched.type}
                      >
                        <FormLabel>Type</FormLabel>
                        <Select placeholder="Select type" {...field}>
                          <option value="physical">Physical</option>
                          <option value="electronic">Electronic</option>
                        </Select>
                        <FormErrorMessage name="type">
                          {errors.type}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="passNumber">
                    {({ field, form }) => (
                      <FormControl
                        mb={4}
                        isInvalid={errors.passNumber && touched.passNumber}
                      >
                        <FormLabel>Pass Number</FormLabel>
                        <Input
                          id="passNumber"
                          type="text"
                          placeholder="Enter pass number"
                          maxLength="22"
                          {...field}
                        />
                        <FormErrorMessage name="passNumber">
                          {errors.passNumber}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </ModalBody>

                <ModalFooter>
                  <Button onClick={closeModal} ref={initialRef} mr={3}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                    disabled={!isValid || !dirty}
                  >
                    Save Changes
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>
    </Flex>
  );
}

export default CreateModal;
