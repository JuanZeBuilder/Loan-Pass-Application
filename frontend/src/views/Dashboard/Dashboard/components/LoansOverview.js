// General imports
import React from "react";

// Chakra imports
import { Flex, Text, useColorModeValue } from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import LoanRow from "./LoanRow.js";

const LoansOverview = (props) => {
  const { title, createItem, data, refresh } = props;

  return (
    <Card>
      <Flex direction="column" minHeight="29rem">
        <CardHeader py="12px" justifyContent="space-between">
          <Text fontSize="xl" fontWeight="bold">
            {title}
          </Text>
          {createItem}
        </CardHeader>
        <CardBody>
          <Flex direction="column" w="100%">
            {data.length > 0 ? (
              data.map((row) => {
                return (
                  <LoanRow
                    key={row.loanID}
                    id={row.loanID}
                    attraction={row.attraction}
                    noOfPass={row.numberOfPassesNeeded}
                    loanPassDate={row.loanPassDate}
                    borrowDate={row.borrowDate}
                    status={row.status}
                    corppassList={row.corppassList}
                    refresh={refresh}
                  />
                );
              })
            ) : (
              <Flex alignItems="center" marginTop={6}>
                <Text fontSize="lg" fontWeight="500" color="gray.500">
                  There are currently no loans...
                </Text>
              </Flex>
            )}
          </Flex>
        </CardBody>
      </Flex>
    </Card>
  );
};

export default LoansOverview;
