// General imports
import React from "react";

// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";

const WelcomeOverview = (props) => {
  const { username, firstName, lastName } = props;

  return (
    <Card>
      <Flex direction="column">
        <CardHeader py="12px" justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="bold">
            Welcome Back,{" "}
            {firstName.charAt(0).toUpperCase() + firstName.slice(1)}{" "}
            {lastName.charAt(0).toUpperCase() + lastName.slice(1)}!
          </Text>
        </CardHeader>
        <CardBody></CardBody>
      </Flex>
    </Card>
  );
};

export default WelcomeOverview;
