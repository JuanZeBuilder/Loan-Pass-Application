// General imports
import React, { useState, useEffect } from "react";
import { templatesData } from "variables/general";

import AdminService from "../../../services/admin.service.js";

// Chakra imports
import { Flex, Grid, Text, useColorModeValue, Spinner } from "@chakra-ui/react";

// Custom components
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody";
import TemplatesTable from "./components/TemplateTable.js";
import ErrorMessage from "components/UI/ErrorMessage.js";

function CorporatePass() {
  const textColor = useColorModeValue("gray.700", "white");

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [LetterPreview, setLetterPreview] = useState("");
  const [EPassPreview, setEPassPreview] = useState("");
  const [PhysicalPassPreview, setPhysicalPassPreview] = useState("");
  const [LetterParameters, setLetterParameters] = useState("");
  const [EPassParameters, setEPassParameters] = useState("");
  const [PhysicalPassParameters, setPhysicalPassParameters] = useState("");
  const [LetterContent, setLetterContent] = useState("");
  const [EPassContent, setEPassContent] = useState("");
  const [PhysicalPassContent, setPhysicalPassContent] = useState("");

  const [refresh, setRefresh] = useState(0);

  const refreshData = () => {
    setRefresh(refresh + 1);
  };

  useEffect(() => {
    fetchTemplates();
  }, [refresh]);

  const fetchTemplates = async () => {
    setIsLoading(true);
    await AdminService.getTemplate("letter").then(
      (response) => {
        setLetterPreview(response.data);
      },
      (error) => {
        setIsError(true);
        console.log(error);
      }
    );

    await AdminService.getTemplate("electronic").then(
      (response) => {
        setEPassPreview(response.data);
      },
      (error) => {
        setIsError(true);
        console.log(error);
      }
    );

    await AdminService.getTemplate("physical").then(
      (response) => {
        setPhysicalPassPreview(response.data);
      },
      (error) => {
        setIsError(true);

        console.log(error);
      }
    );

    await AdminService.getTemplateParameters("letter").then(
      (response) => {
        setLetterParameters(response.data);
      },
      (error) => {
        setIsError(true);
        console.log(error);
      }
    );

    await AdminService.getTemplateParameters("electronic").then(
      (response) => {
        setEPassParameters(response.data);
      },
      (error) => {
        setIsError(true);
        console.log(error);
      }
    );

    await AdminService.getTemplateParameters("physical").then(
      (response) => {
        setPhysicalPassParameters(response.data);
      },
      (error) => {
        setIsError(true);

        console.log(error);
      }
    );

    await AdminService.getEditTemplate("letter").then(
      (response) => {
        setLetterContent(response.data);
      },
      (error) => {
        setIsError(true);
        console.log(error);
      }
    );

    await AdminService.getEditTemplate("electronic").then(
      (response) => {
        setEPassContent(response.data);
      },
      (error) => {
        setIsError(true);
        console.log(error);
      }
    );

    await AdminService.getEditTemplate("physical").then(
      (response) => {
        setPhysicalPassContent(response.data);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setIsError(true);

        console.log(error);
      }
    );
  };

  return (
    <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
      {isLoading ? (
        <Flex justifyContent="center" marginTop={5}>
          <Spinner color="red.500" size="xl" />
        </Flex>
      ) : isError ? (
        <ErrorMessage />
      ) : (
        <TemplatesTable
          title={"Templates Table"}
          captions={["Type", "Template", "Parameters", "Actions"]}
          LetterPreview={LetterPreview}
          EPassPreview={EPassPreview}
          PhysicalPassPreview={PhysicalPassPreview}
          LetterParameters={LetterParameters}
          EPassParameters={EPassParameters}
          PhysicalPassParameters={PhysicalPassParameters}
          LetterTemplate={LetterContent}
          EPassTemplate={EPassContent}
          PhysicalPassTemplate={PhysicalPassContent}
          refresh={refreshData}
        />
      )}
    </Flex>
  );
}

export default CorporatePass;
