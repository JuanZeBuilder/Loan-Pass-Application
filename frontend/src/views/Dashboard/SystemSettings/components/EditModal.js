// General imports
import React, { useState, useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import AdminService from "../../../../services/admin.service.js";

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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  useToast,
} from "@chakra-ui/react";

// Custom components

function EditModal(props) {
  const { setting, settingName, value, refresh } = props;

  const modalSize = "xl";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  var initialValues = {
    limitValue: value,
  };

  const validationSchema = Yup.object().shape({
    limitValue: Yup.string().required("Please enter the setting value!"),
  });

  const updateSetting = (formValue) => {
    const { limitValue } = formValue;
    setIsLoading(true);

    const payload = {
      settingName: setting,
      value: limitValue,
    };

    AdminService.updateSystemSettings(payload).then(
      (response) => {
        setIsLoading(false);
        refresh();
        toast({
          position: "top",
          status: "success",
          isClosable: true,
          title: "Setting Update",
          description: `${settingName} has been successfully updated.`,
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
        onClose={onClose}
        size={modalSize}
      >
        <ModalOverlay />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={updateSetting}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form>
              <ModalContent>
                <ModalHeader>Edit {settingName}</ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                  <Field name="limitValue">
                    {({ field, form }) => (
                      <FormControl
                        mb={4}
                        isInvalid={errors.limitValue && touched.limitValue}
                      >
                        <FormLabel>Limit</FormLabel>
                        <NumberInput
                          id="limitValue"
                          step={1}
                          defaultValue={Number(field.value)}
                        >
                          <NumberInputField
                            {...field}
                            placeholder="Enter limit value"
                          />
                        </NumberInput>
                        <FormErrorMessage name="limitValue">
                          {errors.limitValue}
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
                    disabled={!isValid}
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
