// General imports
import React from "react";

// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import LoanRow from "components/Tables/LoanRow";

const LoanInformation = (props) => {
  const { title, createItem, data } = props;

  return (
    <Card>
      <Flex direction="column">
        <CardHeader py="12px" justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold">
            {title}
          </Text>
          {createItem}
        </CardHeader>
        <CardBody>
          <Flex direction="column" w="100%">
            {data.map((row) => {
              return (
                <LoanRow
                  place={row.place}
                  noOfPass={row.noOfPass}
                  date={row.date}
                  status={row.status}
                />
              );
            })}
          </Flex>
        </CardBody>
      </Flex>
    </Card>
  );
};

export default LoanInformation;
