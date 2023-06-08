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
  Icon,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import { BsCircleFill } from "react-icons/bs";

function EditModal({
  prevMembershipName,
  membershipName,
  membershipType,
  attraction,
  address,
  postalCode,
  replacementFee,
  refresh,
}) {
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
    membershipName: membershipName,
    membershipType: membershipType,
    attraction: attraction,
    address: address,
    postalCode: postalCode,
    replacementFee: replacementFee,
  };

  const validationSchema = Yup.object().shape({
    membershipName: Yup.string().required("Please enter the membership name!"),
    membershipType: Yup.string().required("Please enter the membership type!"),
    attraction: Yup.string().required("Please enter the place of interest!"),
    address: Yup.string().required("Please enter the address!"),
    postalCode: Yup.string().required("Please enter the postal code!"),
    replacementFee: Yup.string().required(
      "Please enter the pass replacement fee!"
    ),
  });

  const editCorporateMembership = (formValue) => {
    const {
      membershipName,
      membershipType,
      attraction,
      address,
      postalCode,
      replacementFee,
    } = formValue;
    setIsLoading(true);

    let postal = `Singapore ${postalCode.replace(/\D+/g, "")}`;

    const payload = {
      membershipName,
      membershipType,
      attraction,
      address,
      postalCode: postal,
      replacementFee: parseFloat(replacementFee).toFixed(2),
    };

    AdminService.editCorporateMembership(prevMembershipName, payload).then(
      (response) => {
        setIsLoading(false);
        refresh();
        toast({
          position: "top",
          status: "success",
          isClosable: true,
          title: "Corporate Membership Updated",
          description: `${membershipName} membership has been updated.`,
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
      <Button
        color="gray.500"
        variant="unstyled"
        minWidth="auto"
        me={2}
        ref={finalRef}
        onClick={onOpen}
        _hover={{ color: "gray.400" }}
      >
        Edit
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
          onSubmit={editCorporateMembership}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form>
              <ModalContent>
                <ModalHeader>Edit {membershipName}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <Field name="membershipName">
                    {({ field, form }) => (
                      <FormControl
                        mb={4}
                        isInvalid={
                          errors.membershipName && touched.membershipName
                        }
                      >
                        <FormLabel>Membership Name</FormLabel>
                        <Input
                          id="membershipName"
                          type="text"
                          placeholder="Enter membership name"
                          {...field}
                        />
                        <FormErrorMessage name="membershipName">
                          {errors.membershipName}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="membershipType">
                    {({ field, form }) => (
                      <FormControl
                        mb={4}
                        isInvalid={
                          errors.membershipType && touched.membershipType
                        }
                      >
                        <FormLabel>Membership Type</FormLabel>
                        <Input
                          id="membershipType"
                          type="text"
                          placeholder="Enter membership type"
                          {...field}
                        />
                        <FormErrorMessage name="membershipType">
                          {errors.membershipType}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="attraction">
                    {({ field, form }) => (
                      <FormControl
                        mb={4}
                        isInvalid={errors.attraction && touched.attraction}
                      >
                        <FormLabel>Place of Interest</FormLabel>
                        <Input
                          id="attraction"
                          type="text"
                          placeholder="Enter place of interest"
                          {...field}
                        />
                        <FormErrorMessage name="attraction">
                          {errors.attraction}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="address">
                    {({ field, form }) => (
                      <FormControl
                        mb={4}
                        isInvalid={errors.address && touched.address}
                      >
                        <FormLabel>Address</FormLabel>
                        <Input
                          id="address"
                          type="text"
                          placeholder="Enter address"
                          {...field}
                        />
                        <FormErrorMessage name="address">
                          {errors.address}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="postalCode">
                    {({ field, form }) => (
                      <FormControl
                        mb={4}
                        isInvalid={errors.postalCode && touched.postalCode}
                      >
                        <FormLabel>Postal Code</FormLabel>
                        <Input
                          id="postalCode"
                          type="text"
                          placeholder="Enter postal code"
                          {...field}
                        />
                        <FormErrorMessage name="postalCode">
                          {errors.postalCode}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="replacementFee">
                    {({ field, form }) => (
                      <FormControl
                        mb={4}
                        isInvalid={
                          errors.replacementFee && touched.replacementFee
                        }
                      >
                        <FormLabel>Replacement Fee</FormLabel>
                        <NumberInput
                          id="replacementFee"
                          min={0}
                          precision={2}
                          defaultValue={Number(field.value)}
                        >
                          <NumberInputField
                            {...field}
                            placeholder="Enter replacement fee"
                          />
                        </NumberInput>
                        <FormErrorMessage name="replacementFee">
                          {errors.replacementFee}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose} ref={initialRef} mr={3}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
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

export default EditModal;
