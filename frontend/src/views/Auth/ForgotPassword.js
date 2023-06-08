// General imports
import React, { useState, useEffect } from "react";
import { Link as ReachLink, Redirect } from "react-router-dom";
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
  Text,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { ChevronLeftIcon, CloseIcon } from "@chakra-ui/icons";

// Custom components
import { login } from "slices/auth";
import { clearMessage } from "slices/message";

import SideContent from "./components/SideContent";

function ForgotPassword() {
  // Chakra color mode
  const titleColor = useColorModeValue("#ff2b4e", "red.200");
  const textColor = useColorModeValue("gray.400", "white");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    username: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .email("Invalid email address!")
      .required("Please enter your email address!"),
  });

  const onClick = () => setError(false);

  const handleResetPassword = (formValue) => {
    const { username } = formValue;
    setIsLoading(true);
    setError(true);
    setIsLoading(false);
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Flex position="relative" backgroundColor="#FDFDFD">
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
            onClick={onClick}
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
            mt={{ md: "150px", lg: "80px" }}
          >
            <Heading color={titleColor} fontSize="3xl" mb="10px">
              Forgot Password?
            </Heading>
            <Text mb={10} color={textColor} fontWeight="bold" fontSize="sm">
              Enter your email address and we'll send you instructions to reset
              your password!
            </Text>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleResetPassword}
            >
              {({ errors, touched }) => (
                <Form>
                  {" "}
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
                    Reset Password
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
                Don't have an account?
                <Link
                  as={ReachLink}
                  to="/auth/signup"
                  color={titleColor}
                  ms="5px"
                  fontWeight="medium"
                >
                  Sign Up
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

export default ForgotPassword;
