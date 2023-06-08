// General imports
import React from "react";

// Chakra imports
import { Flex, Heading, Text } from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";

// Custom components

export function ErrorMessage() {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      marginTop={5}
    >
      <WarningIcon width={12} height={12} color="gray.500" />
      <Flex flexDirection="column" alignItems="center" marginTop={4}>
        <Heading as="h5" size="lg" fontWeight="500" color="gray.700">
          Oops! Something went wrong...
        </Heading>
        <Text fontSize="lg" marginTop={1} color="gray.600">
          Please contact the administrator!
        </Text>
      </Flex>
    </Flex>
  );
}

export default ErrorMessage;
