// General imports
import React from "react";

// Chakra imports
import { Box } from "@chakra-ui/react";

// Custom components
import hero from "assets/img/hero.png";

function SideContent() {
  return (
    <Box
      display={{ base: "none", md: "block" }}
      overflowX="hidden"
      h="100%"
      w="45vw"
      position="absolute"
      right="0px"
      backgroundColor="#ff2b4e"
    >
      <Box
        bgImage={hero}
        w="100%"
        h="100%"
        bgSize="cover"
        bgPosition="50%"
        position="absolute"
      ></Box>
    </Box>
  );
}

export default SideContent;
