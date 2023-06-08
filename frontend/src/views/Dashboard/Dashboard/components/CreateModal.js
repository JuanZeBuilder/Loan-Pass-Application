// General imports
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import UserService from "../../../../services/user.service.js";

// Chakra imports
import { useDisclosure } from "@chakra-ui/react";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Select,
  useToast,
} from "@chakra-ui/react";

// Custom components

function CreateModal({ attractions, refresh }) {
  const modalSize = "xl";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  // Form
  const [isLoading, setIsLoading] = useState(false);
  const [attractionOptions, setAttractionOptions] = useState([]);

  const { user: currentUser } = useSelector((state) => state.auth);

  const toast = useToast();

  const today = new Date();
  const currentDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    getAttractionOptions();
  }, [attractions]);

  const getAttractionOptions = () => {
    let options = [];

    for (let i = 0; i < attractions.length; i++) {
      options.push(
        <option key={i} value={attractions[i]}>
          {attractions[i]}
        </option>
      );
    }

    setAttractionOptions(options);
  };

  var initialValues = {
    attraction: "",
    noOfPasses: "",
    bookingDate: "",
  };

  const validationSchema = Yup.object().shape({
    attraction: Yup.string().required("Please select the place of interest!"),
    noOfPasses: Yup.string().required(
      "Please select the number of passes required!"
    ),
    bookingDate: Yup.date()
      .min(currentDate, "Booking date must not be a past date!")
      .required("Please select the booking date!"),
  });

  const createLoanPass = (formValue) => {
    const { attraction, noOfPasses, bookingDate } = formValue;
    setIsLoading(true);

    const payload = {
      email: currentUser.username,
      username: currentUser.firstName + " " + currentUser.lastName,
      attraction: attraction,
      numberOfPassesNeeded: Number(noOfPasses),
      loanPassDate: bookingDate,
      status: "pending",
    };

    UserService.createLoan(payload).then(
      (response) => {
        setIsLoading(false);
        refresh();
        toast({
          position: "top",
          status: "success",
          isClosable: true,
          title: "Loan Success",
          description: `${attraction} has been successfully loaned.`,
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
        Loan Pass
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

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={createLoanPass}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form>
              <ModalContent>
                <ModalHeader>Loan Pass</ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                  <Field name="attraction">
                    {({ field, form }) => (
                      <FormControl
                        mb={4}
                        isInvalid={errors.attraction && touched.attraction}
                      >
                        <FormLabel>Place of Interest</FormLabel>
                        <Select
                          placeholder="Select place of interest"
                          {...field}
                        >
                          {attractionOptions}
                        </Select>
                        <FormErrorMessage name="attraction">
                          {errors.attraction}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="noOfPasses">
                    {({ field, form }) => (
                      <FormControl
                        mb={4}
                        isInvalid={errors.noOfPasses && touched.noOfPasses}
                      >
                        <FormLabel>Number of Passes</FormLabel>
                        <Select
                          placeholder="Select number of passes"
                          {...field}
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                        </Select>
                        <FormErrorMessage name="noOfPasses">
                          {errors.noOfPasses}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="bookingDate">
                    {({ field, form }) => (
                      <FormControl
                        mb={4}
                        isInvalid={errors.bookingDate && touched.bookingDate}
                      >
                        <FormLabel>Booking Date</FormLabel>
                        <Input
                          type="date"
                          placeholder="Enter booking date"
                          min={currentDate}
                          {...field}
                        />
                        <FormErrorMessage name="bookingDate">
                          {errors.bookingDate}
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
