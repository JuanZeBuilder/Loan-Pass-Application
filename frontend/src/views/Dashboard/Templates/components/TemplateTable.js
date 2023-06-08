// General imports
import React from "react";

// Chakra imports
import {
  Flex,
  Grid,
  Icon,
  Table,
  Tbody,
  Text,
  Th,
  Td,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody";
import PhysicalCardEmailModal from "./PhysicalCardEmailModal.js";
import DigitalCardEmailModal from "./DigitalCardEmailModal.js";
import PdfModal from "./PdfModal.js";
import AppendixModal from "./AppendixModal.js";
import EditModal from "./EditModal.js";

const Projects = ({
  title,
  captions,
  LetterPreview,
  EPassPreview,
  PhysicalPassPreview,
  LetterParameters,
  EPassParameters,
  PhysicalPassParameters,
  LetterTemplate,
  EPassTemplate,
  PhysicalPassTemplate,
  refresh,
}) => {
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Card p="16px" overflowX={{ sm: "scroll", xl: "hidden" }}>
      <CardHeader p="12px 0px 28px 0px">
        <Flex direction="column">
          <Text fontSize="lg" color={textColor} fontWeight="bold" pb=".5rem">
            {title}
          </Text>
        </Flex>
      </CardHeader>
      <Table variant="simple" color={textColor}>
        <Thead>
          <Tr my=".8rem" ps="0px">
            {captions.map((caption, idx) => {
              return (
                <Th color="gray.400" key={idx} ps={idx === 0 ? "0px" : null}>
                  {caption}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td minWidth={{ sm: "250px" }} pl="0px">
              <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                <Text fontSize="sm" color="gray.500" minWidth="100%">
                  Authorization Letter
                </Text>
              </Flex>
            </Td>
            <Td>
              <PdfModal template={LetterPreview} />
            </Td>
            <Td>
              <AppendixModal parameters={LetterParameters} />
            </Td>
            <Td>
              <EditModal
                header="Authorization Letter"
                type="letter"
                template={LetterTemplate}
                refresh={refresh}
              />
            </Td>
          </Tr>
          <Tr>
            <Td minWidth={{ sm: "250px" }} pl="0px">
              <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                <Text fontSize="sm" color="gray.500" minWidth="100%">
                  ePass Email
                </Text>
              </Flex>
            </Td>
            <Td>
              <DigitalCardEmailModal template={EPassPreview} />
            </Td>
            <Td>
              <AppendixModal parameters={EPassParameters} />
            </Td>
            <Td>
              <EditModal
                header="ePass Email"
                type="electronic"
                template={EPassTemplate}
                refresh={refresh}
              />
            </Td>
          </Tr>
          <Tr>
            <Td minWidth={{ sm: "250px" }} pl="0px">
              <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
                <Text fontSize="sm" color="gray.500" minWidth="100%">
                  Physical Pass Email
                </Text>
              </Flex>
            </Td>
            <Td>
              <PhysicalCardEmailModal template={PhysicalPassPreview} />
            </Td>
            <Td>
              <AppendixModal parameters={PhysicalPassParameters} />
            </Td>
            <Td>
              <EditModal
                header="Physical Pass Email"
                type="physical"
                template={PhysicalPassTemplate}
                refresh={refresh}
              />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Card>
  );
};

export default Projects;
