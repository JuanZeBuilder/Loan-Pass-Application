// General imports
import React, { useState, useEffect } from "react";
import {
  NavLink,
  Link as ReachLink,
  Redirect,
  useHistory,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Chakra imports
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Link,
  Switch,
  Text,
  NumberInput,
  NumberInputField,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ChevronLeftIcon, CloseIcon } from "@chakra-ui/icons";

// Custom components
import { register } from "slices/auth";
import { clearMessage } from "slices/message";

import SideContent from "./components/SideContent";

function SignUp() {
  // Chakra color mode
  const titleColor = useColorModeValue("#ff2b4e", "red.200");
  const textColor = useColorModeValue("gray.400", "white");

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    firstName: "",
    lastName: "",
    contactNumber: "",
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Please enter your first name!"),
    lastName: Yup.string().required("Please enter your last name!"),
    contactNumber: Yup.string()
      .min(8, "Contact should be an 8-digit number!")
      .required("Please enter your contact number!"),
    username: Yup.string()
      .email("Invalid email address!")
      .required("Please enter your email address!"),
    password: Yup.string().required("Please enter your password!"),
  });

  const closeErrorAlert = () => setError(false);
  const closeSuccessAlert = () => setSuccess(false);

  const handleRegister = (formValue) => {
    const {
      firstName,
      lastName,
      contactNumber,
      username,
      password,
    } = formValue;
    setIsLoading(true);

    dispatch(
      register({ firstName, lastName, contactNumber, username, password })
    )
      .unwrap()
      .then(() => {
        setIsLoading(false);
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch(() => {
        setIsLoading(false);
        setSuccess(false);
        setError(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Flex position="relative" backgroundColor="#FDFDFD">
      {success ? (
        <Flex
          position="absolute"
          zIndex={2}
          w="100%"
          h="65px"
          backgroundColor="green.300"
          justifyContent="center"
          alignItems="center"
          fontWeight="medium"
          color="white"
        >
          <Text>A verification email has been sent to the email address!</Text>
          <IconButton
            position="absolute"
            right="4"
            aria-label="Close Alert"
            variant="unstyled"
            size="sm"
            icon={<CloseIcon />}
            onClick={closeSuccessAlert}
          />
        </Flex>
      ) : null}

      {error ? (
        <Flex
          position="absolute"
          zIndex={2}
          w="100%"
          h="65px"
          backgroundColor="red.300"
          justifyContent="center"
          alignItems="center"
          fontWeight="medium"
          color="white"
        >
          <Text>
            {!(message.length == 0) && message.includes("Error:")
              ? message.slice(7)
              : "Oops! Something went wrong..."}
          </Text>
          <IconButton
            position="absolute"
            right="4"
            aria-label="Close Alert"
            variant="unstyled"
            size="sm"
            icon={<CloseIcon />}
            onClick={closeErrorAlert}
          />
        </Flex>
      ) : null}
      <Flex
        minHeight="100vh"
        w="100%"
        maxW="1200px"
        mx="auto"
        justifyContent="space-between"
        pt={{ sm: "100px", md: "0px" }}
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}
        >
          <Link
            as={ReachLink}
            to="/auth/signin"
            position="absolute"
            top="5"
            left="5"
            borderRadius="50%"
            h="45px"
            w="45px"
            bg="gray.200"
            _hover={{
              bg: "gray.100",
            }}
            _active={{
              bg: "gray.300",
            }}
          >
            <Flex h="100%" alignItems="center" justifyContent="center">
              <ChevronLeftIcon w={5} h={5} color="gray.500" />
            </Flex>
          </Link>
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            p="30px"
            mt={{ md: "100px", lg: "80px" }}
          >
            <Heading color={titleColor} fontSize="3xl" mb="10px">
              Sign Up
            </Heading>
            <Text mb={10} color={textColor} fontWeight="bold" fontSize="sm">
              Enter the following details to create an account
            </Text>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleRegister}
            >
              {({ errors, touched }) => (
                <Form>
                  <Flex justifyContent="space-between">
                    <Field name="firstName">
                      {({ field, form }) => (
                        <FormControl
                          me={5}
                          mb={6}
                          isInvalid={errors.firstName && touched.firstName}
                        >
                          <FormLabel ms="4px" fontSize="sm" fontWeight="medium">
                            First Name
                          </FormLabel>
                          <Input
                            id="firstName"
                            type="text"
                            borderRadius="15px"
                            fontSize="sm"
                            placeholder="Your first name"
                            size="lg"
                            {...field}
                          />
                          <FormErrorMessage name="firstName">
                            {errors.firstName}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="lastName">
                      {({ field, form }) => (
                        <FormControl
                          mb={6}
                          isInvalid={errors.lastName && touched.lastName}
                        >
                          <FormLabel ms="4px" fontSize="sm" fontWeight="medium">
                            Last Name
                          </FormLabel>
                          <Input
                            id="lastName"
                            type="text"
                            borderRadius="15px"
                            fontSize="sm"
                            placeholder="Your last name"
                            size="lg"
                            {...field}
                          />
                          <FormErrorMessage name="lastName">
                            {errors.lastName}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Flex>
                  <Field name="contactNumber">
                    {({ field, form }) => (
                      <FormControl
                        mb={6}
                        isInvalid={
                          errors.contactNumber && touched.contactNumber
                        }
                      >
                        <FormLabel ms="4px" fontSize="sm" fontWeight="medium">
                          Contact
                        </FormLabel>
                        <Input
                          id="contactNumber"
                          type="tel"
                          borderRadius="15px"
                          fontSize="sm"
                          placeholder="Your contact number"
                          size="lg"
                          maxLength="8"
                          {...field}
                        />
                        <FormErrorMessage name="contactNumber">
                          {errors.contactNumber}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="username">
                    {({ field, form }) => (
                      <FormControl
                        mb={6}
                        isInvalid={errors.username && touched.username}
                      >
                        <FormLabel ms="4px" fontSize="sm" fontWeight="medium">
                          Email Address
                        </FormLabel>
                        <Input
                          id="email"
                          type="email"
                          borderRadius="15px"
                          fontSize="sm"
                          placeholder="Your email address"
                          size="lg"
                          {...field}
                        />
                        <FormErrorMessage name="username">
                          {errors.username}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {({ field, form }) => (
                      <FormControl
                        mb={6}
                        isInvalid={errors.password && touched.password}
                      >
                        <FormLabel ms="4px" fontSize="sm" fontWeight="medium">
                          Password
                        </FormLabel>
                        <Input
                          id="password"
                          type="password"
                          borderRadius="15px"
                          fontSize="sm"
                          placeholder="Your password"
                          size="lg"
                          {...field}
                        />
                        <FormErrorMessage name="password">
                          {errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Button
                    fontSize="sm"
                    type="submit"
                    bg="#ff2b4e"
                    w="100%"
                    h="45"
                    mb={8}
                    mt={2}
                    color="white"
                    _hover={{
                      bg: "red.400",
                    }}
                    _active={{
                      bg: "red.500",
                    }}
                    isLoading={isLoading}
                  >
                    Create Account
                  </Button>
                </Form>
              )}
            </Formik>

            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              maxW="100%"
              mt="0px"
            >
              <Text color={textColor} fontWeight="medium">
                Already have an account?
                <Link
                  as={ReachLink}
                  to="/auth/signin"
                  color={titleColor}
                  ms="5px"
                  fontWeight="medium"
                >
                  Sign In
                </Link>
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <SideContent />
      </Flex>
    </Flex>
  );
}

export default SignUp;
