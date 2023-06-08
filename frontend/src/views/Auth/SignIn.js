// General imports
import React, { useState, useEffect } from "react";
import { Link as ReachLink, Redirect, useHistory } from "react-router-dom";
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
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

// Custom components
import { login } from "slices/auth";
import { clearMessage } from "slices/message";

import SideContent from "./components/SideContent";

function SignIn() {
  // Chakra color mode
  const titleColor = useColorModeValue("#ff2b4e", "red.200");
  const textColor = useColorModeValue("gray.400", "white");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .email("Invalid email address!")
      .required("Please enter your email address!"),
    password: Yup.string().required("Please enter your password!"),
  });

  const onClick = () => setError(false);

  const handleLogin = (formValue) => {
    const { username, password } = formValue;
    setIsLoading(true);

    dispatch(login({ username, password }))
      .unwrap()
      .then(() => {
        history.push("/");
      })
      .catch((error) => {
        setIsLoading(false);
        setError(true);
      });
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
          <Flex
            direction="column"
            w="100%"
            background="transparent"
            p="30px"
            mt={{ md: "150px", lg: "80px" }}
          >
            <Heading color={titleColor} fontSize="3xl" mb="10px">
              Login
            </Heading>
            <Text mb={10} color={textColor} fontWeight="bold" fontSize="sm">
              Welcome back! Enter your details to login
            </Text>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ errors, touched }) => (
                <Form>
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

                  <Flex justify="space-between" my={5}>
                    <FormControl display="flex" alignItems="center" w="100%">
                      <Switch id="remember-login" colorScheme="red" me="10px" />
                      <FormLabel
                        htmlFor="remember-login"
                        mb="0"
                        ms="1"
                        fontWeight="normal"
                      >
                        Remember me
                      </FormLabel>
                    </FormControl>
                    <Link
                      as={ReachLink}
                      to="/auth/forgotpassword"
                      color={"blue.400"}
                      w="100%"
                      textAlign="end"
                      fontWeight="normal"
                    >
                      Forgot Password
                    </Link>
                  </Flex>
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
                    Sign In
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

export default SignIn;
