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

function CreateModal({ refresh }) {
  const modalSize = "xl";
  const { isOpen, onOpen, onClose } = useDisclosure();
  const closeModal = () => {
    setTabIndex(0);
    setActiveBullets({
      details: true,
      passes: false,
    });
    setNoOfPasses("0");
    setPasses([]);
    onClose();
  };

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const scrollBehavior = "inside";

  // Tabs
  const textColor = useColorModeValue("gray.700", "white");
  const [activeBullets, setActiveBullets] = useState({
    details: true,
    passes: false,
  });

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  const changeDetailsTab = () => {
    setActiveBullets({
      details: true,
      passes: false,
    });
    setTabIndex(0);
  };

  const changePassesTab = () => {
    setActiveBullets({
      details: true,
      passes: true,
    });
    setTabIndex(1);
  };

  // Form
  const [isLoading, setIsLoading] = useState(false);
  const [noOfPasses, setNoOfPasses] = useState("0");
  const [passes, setPasses] = useState([]);
  const [passesObject, setPassesObject] = useState({});

  const toast = useToast();

  const createPasses = () => {
    let passes = [];
    const size = Math.min(noOfPasses, 5);

    for (let i = 1; i <= size; i++) {
      const passNumberChange = (e) => {
        setPassesObject((prevState) => ({
          ...prevState,
          [`pass${i}Number`]: e.target.value,
        }));
      };

      const passTypeChange = (e) => {
        setPassesObject((prevState) => ({
          ...prevState,
          [`pass${i}Type`]: e.target.value,
        }));
      };

      passes.push(
        <Grid key={i} templateColumns="1.2fr 0.8fr" gap={5} mb={4}>
          <FormControl>
            <FormLabel>Pass Number</FormLabel>
            <Input
              type="text"
              placeholder="Enter pass number"
              maxLength="22"
              onChange={passNumberChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Type</FormLabel>
            <Select placeholder="Select type" onChange={passTypeChange}>
              <option value="physical">Physical</option>
              <option value="electronic">Electronic</option>
            </Select>
          </FormControl>
        </Grid>
      );
    }

    setPasses(passes);
  };

  var initialValues = {
    membershipName: "",
    membershipType: "",
    attraction: "",
    address: "",
    postalCode: "",
    replacementFee: "",
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

  const createCorporateMembership = (formValue) => {
    const {
      membershipName,
      membershipType,
      attraction,
      address,
      postalCode,
      replacementFee,
    } = formValue;
    setIsLoading(true);

    let type = [];
    let barcodeId = [];
    let postal = `Singapore ${postalCode.replace(/\D+/g, "")}`;

    for (let key in passesObject) {
      if (key.includes("Number")) {
        barcodeId.push(passesObject[key]);
      }

      if (key.includes("Type")) {
        type.push(passesObject[key]);
      }
    }

    const payload = {
      membershipName,
      membershipType,
      attraction,
      address,
      replacementFee,
      postalCode: postal,
      id: barcodeId,
      barcodeId: barcodeId,
      type: type,
      status: "available",
      active: "true",
    };

    AdminService.createMembership(payload).then(
      (response) => {
        setIsLoading(false);
        refresh();
        toast({
          position: "top",
          status: "success",
          isClosable: true,
          title: "Corporate Membership Created",
          description: `${membershipName} membership has been created.`,
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

    setNoOfPasses("0");
    setPasses([]);
    changeDetailsTab();

    onClose();
  };

  return (
    <Flex>
      <Button colorScheme="teal" size="sm" ref={finalRef} onClick={onOpen}>
        Create Membership
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
          onSubmit={createCorporateMembership}
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form>
              <ModalContent>
                <ModalHeader>Create Membership</ModalHeader>
                <ModalCloseButton />

                <ModalBody pb={6}>
                  <Tabs
                    variant="unstyled"
                    mt={2}
                    display="flex"
                    flexDirection="column"
                    index={tabIndex}
                  >
                    <TabList
                      display="flex"
                      align="center"
                      alignSelf="center"
                      justifySelf="center"
                    >
                      <Tab
                        _focus={{}}
                        w={{ sm: "150px", md: "200px", lg: "200px" }}
                      >
                        <Flex
                          direction="column"
                          justify="center"
                          align="center"
                          position="relative"
                          _before={{
                            content: "''",
                            width: { sm: "150px", md: "200px", lg: "200px" },
                            height: "3px",
                            bg: activeBullets.passes ? textColor : "gray.200",
                            left: { sm: "12px", md: "20px" },
                            top: {
                              sm: activeBullets.details ? "6px" : "4px",
                              md: null,
                            },
                            position: "absolute",
                            bottom: activeBullets.details ? "40px" : "38px",
                            zIndex: -1,
                            transition: "all .3s ease",
                          }}
                        >
                          <Icon
                            as={BsCircleFill}
                            color={
                              activeBullets.details ? textColor : "gray.300"
                            }
                            w={activeBullets.details ? "16px" : "12px"}
                            h={activeBullets.details ? "16px" : "12px"}
                            mb="8px"
                          />
                          <Text
                            color={
                              activeBullets.details ? { textColor } : "gray.300"
                            }
                            fontWeight={
                              activeBullets.details ? "bold" : "normal"
                            }
                            display={{ sm: "none", md: "block" }}
                            fontSize="sm"
                          >
                            Details
                          </Text>
                        </Flex>
                      </Tab>
                      <Tab
                        _focus={{}}
                        w={{ sm: "150px", md: "200px", lg: "200px" }}
                      >
                        <Flex
                          direction="column"
                          justify="center"
                          align="center"
                          position="relative"
                        >
                          <Icon
                            as={BsCircleFill}
                            color={
                              activeBullets.passes ? textColor : "gray.300"
                            }
                            w={activeBullets.passes ? "16px" : "12px"}
                            h={activeBullets.passes ? "16px" : "12px"}
                            mb="8px"
                          />
                          <Text
                            color={
                              activeBullets.passes ? { textColor } : "gray.300"
                            }
                            fontWeight={
                              activeBullets.passes ? "bold" : "normal"
                            }
                            display={{ sm: "none", md: "block" }}
                            fontSize="sm"
                          >
                            Passes
                          </Text>
                        </Flex>
                      </Tab>
                    </TabList>

                    <TabPanels mt={8}>
                      <TabPanel p="0px">
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
                              isInvalid={
                                errors.attraction && touched.attraction
                              }
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
                              isInvalid={
                                errors.postalCode && touched.postalCode
                              }
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
                      </TabPanel>
                      <TabPanel p="0px">
                        <FormControl mb={4}>
                          <FormLabel>Number of Passes</FormLabel>
                          <NumberInput
                            onChange={(valueString) =>
                              setNoOfPasses(valueString)
                            }
                            onBlur={() => {
                              createPasses();
                            }}
                            value={noOfPasses}
                            defaultValue={0}
                            min={0}
                            max={5}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                        {passes}
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </ModalBody>

                {tabIndex === 0 ? (
                  <ModalFooter>
                    <Button
                      ref={initialRef}
                      onClick={() => changePassesTab()}
                      disabled={!isValid || !dirty}
                    >
                      Next
                    </Button>
                  </ModalFooter>
                ) : (
                  <ModalFooter>
                    <Button onClick={() => changeDetailsTab()} mr={3}>
                      Back
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="blue"
                      isLoading={isLoading}
                      disabled={Object.keys(passesObject).length === 0}
                    >
                      Save Changes
                    </Button>
                  </ModalFooter>
                )}
              </ModalContent>
            </Form>
          )}
        </Formik>
      </Modal>
    </Flex>
  );
}

export default CreateModal;
