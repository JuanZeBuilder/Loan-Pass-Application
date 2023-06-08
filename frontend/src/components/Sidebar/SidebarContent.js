// General imports
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

// Chakra imports
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Flex,
  Icon,
  Img,
  Link,
  Stack,
  Text,
  UnorderedList,
  List,
  ListItem,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import { Separator } from "components/Separator/Separator";
import IconBox from "components/Icons/IconBox";

import logo from "assets/img/logo.png";

const SidebarContent = ({ routes }) => {
  const [state, setState] = useState({});
  const [showGOPLinks, setShowGOPLinks] = useState(false);
  const [showAdminLinks, setShowAdminLinks] = useState(false);

  let location = useLocation();

  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (currentUser) {
      setShowGOPLinks(currentUser.roles.includes("ROLE_GOP"));
      setShowAdminLinks(currentUser.roles.includes("ROLE_ADMIN"));
    } else {
      setShowGOPLinks(false);
      setShowAdminLinks(false);
    }
  });

  // Verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname === routeName ? "active" : "";
  };

  const createLinks = (routes) => {
    const activeBg = useColorModeValue("white", "gray.700");
    const inactiveBg = useColorModeValue("white", "gray.700");
    const activeColor = useColorModeValue("gray.700", "white");
    const inactiveColor = useColorModeValue("gray.400", "gray.400");

    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }
      if (prop.category) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <div key={prop.name}>
            <Text
              color={activeColor}
              fontWeight="bold"
              mb={{
                xl: "12px",
              }}
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              py="12px"
            >
              {prop.name}
            </Text>
            {createLinks(prop.views)}
          </div>
        );
      }

      if (
        prop.toggle &&
        ((prop.role == "Admin" && showAdminLinks) ||
          (prop.role == "GOP" && showGOPLinks) ||
          !prop.role)
      ) {
        var st = {};
        st[prop["state"]] = !state[prop.state];
        return (
          <div key={prop.name}>
            <Accordion
              allowToggle
              mb={{
                xl: "12px",
              }}
            >
              <AccordionItem border="none">
                {prop.views.some((link) => {
                  return activeRoute(link.layout + link.path) === "active";
                }) ? (
                  <AccordionButton
                    boxSize="initial"
                    justifyContent="space-between"
                    bg={activeBg}
                    mx={{
                      xl: "auto",
                    }}
                    py="12px"
                    ps={{
                      sm: "10px",
                      xl: "16px",
                    }}
                    borderRadius="15px"
                    _hover={{}}
                    w="100%"
                    _active={{
                      bg: "inherit",
                      transform: "none",
                      borderColor: "transparent",
                    }}
                    _focus={{
                      boxShadow: "none",
                    }}
                  >
                    <Flex>
                      {typeof prop.icon === "string" ? (
                        <Icon>{prop.icon}</Icon>
                      ) : (
                        <IconBox
                          bg="#ff2b4e"
                          color="white"
                          h="30px"
                          w="30px"
                          me="12px"
                        >
                          {prop.icon}
                        </IconBox>
                      )}
                      <Text
                        fontWeight="bold"
                        color={activeColor}
                        my="auto"
                        fontSize="sm"
                      >
                        {prop.name}
                      </Text>
                    </Flex>
                    <AccordionIcon color={activeColor} />
                  </AccordionButton>
                ) : (
                  <AccordionButton
                    boxSize="initial"
                    justifyContent="space-between"
                    bg="transparent"
                    mx={{
                      xl: "auto",
                    }}
                    py="12px"
                    ps={{
                      sm: "10px",
                      xl: "16px",
                    }}
                    borderRadius="15px"
                    _hover={{}}
                    w="100%"
                    _active={{
                      bg: "inherit",
                      transform: "none",
                      borderColor: "transparent",
                    }}
                    _focus={{
                      boxShadow: "none",
                    }}
                  >
                    <Flex>
                      {typeof prop.icon === "string" ? (
                        <Icon>{prop.icon}</Icon>
                      ) : (
                        <IconBox
                          bg={inactiveBg}
                          color="#ff2b4e"
                          h="30px"
                          w="30px"
                          me="12px"
                        >
                          {prop.icon}
                        </IconBox>
                      )}
                      <Text
                        fontWeight="bold"
                        color={inactiveColor}
                        my="auto"
                        fontSize="sm"
                      >
                        {prop.name}
                      </Text>
                    </Flex>
                    <AccordionIcon color={inactiveColor} />
                  </AccordionButton>
                )}
                <AccordionPanel pb={0}>
                  <UnorderedList listStyleType="none">
                    {prop.views.map((link) => {
                      return (
                        <ListItem
                          key={link.name}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <NavLink to={link.layout + link.path}>
                            {activeRoute(link.layout + link.path) ===
                            "active" ? (
                              <Stack
                                direction="row"
                                alignItems="center"
                                mx="0px"
                                py="8px"
                              >
                                <Icon
                                  viewBox="0 0 200 200"
                                  color="red.500"
                                  boxSize={3}
                                  me="8px"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                                  />
                                </Icon>
                                <Text
                                  color={activeColor}
                                  fontWeight="bold"
                                  fontSize="sm"
                                >
                                  {link.name}
                                </Text>
                              </Stack>
                            ) : (
                              <Stack
                                direction="row"
                                alignItems="center"
                                mx="0px"
                                py="8px"
                              >
                                <Icon
                                  viewBox="0 0 200 200"
                                  color="red.500"
                                  boxSize={2}
                                  me="12px"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
                                  />
                                </Icon>
                                <Text color={inactiveColor} fontSize="sm">
                                  {link.name}
                                </Text>
                              </Stack>
                            )}
                          </NavLink>
                        </ListItem>
                      );
                    })}
                  </UnorderedList>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </div>
        );
      }

      if (
        !prop.toggle &&
        ((prop.role == "Admin" && showAdminLinks) ||
          (prop.role == "GOP" && showGOPLinks) ||
          !prop.role)
      ) {
        return (
          <NavLink to={prop.layout + prop.path} key={prop.name}>
            {activeRoute(prop.layout + prop.path) === "active" ? (
              <Button
                boxSize="initial"
                justifyContent="flex-start"
                alignItems="center"
                bg={activeBg}
                mb={{
                  xl: "12px",
                }}
                mx={{
                  xl: "auto",
                }}
                ps={{
                  sm: "10px",
                  xl: "16px",
                }}
                py="12px"
                borderRadius="15px"
                _hover={{}}
                w="100%"
                _active={{
                  bg: "inherit",
                  transform: "none",
                  borderColor: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                <Flex>
                  {typeof prop.icon === "string" ? (
                    <Icon>{prop.icon}</Icon>
                  ) : (
                    <IconBox
                      bg="#ff2b4e"
                      color="white"
                      h="30px"
                      w="30px"
                      me="12px"
                    >
                      {prop.icon}
                    </IconBox>
                  )}
                  <Text color={activeColor} my="auto" fontSize="sm">
                    {prop.name}
                  </Text>
                </Flex>
              </Button>
            ) : (
              <Button
                boxSize="initial"
                justifyContent="flex-start"
                alignItems="center"
                bg="transparent"
                mb={{
                  xl: "12px",
                }}
                mx={{
                  xl: "auto",
                }}
                py="12px"
                ps={{
                  sm: "10px",
                  xl: "16px",
                }}
                borderRadius="15px"
                _hover={{}}
                w="100%"
                _active={{
                  bg: "inherit",
                  transform: "none",
                  borderColor: "transparent",
                }}
                _focus={{
                  boxShadow: "none",
                }}
              >
                <Flex>
                  {typeof prop.icon === "string" ? (
                    <Icon>{prop.icon}</Icon>
                  ) : (
                    <IconBox
                      bg={inactiveBg}
                      color="#ff2b4e"
                      h="30px"
                      w="30px"
                      me="12px"
                    >
                      {prop.icon}
                    </IconBox>
                  )}
                  <Text color={inactiveColor} my="auto" fontSize="sm">
                    {prop.name}
                  </Text>
                </Flex>
              </Button>
            )}
          </NavLink>
        );
      }

      return null;
    });
  };

  const links = <>{createLinks(routes)}</>;

  return (
    <>
      <Box pt={"25px"} mb="12px">
        <Link
          href={`${process.env.PUBLIC_URL}/#/`}
          display="flex"
          lineHeight="100%"
          mb="30px"
          fontWeight="bold"
          justifyContent="center"
          alignItems="center"
          fontSize="11px"
        >
          <Img
            objectFit="cover"
            src={logo}
            width="80%"
            height="80%"
            alt="Singapore Sports School Logo"
          />
        </Link>
        <Separator></Separator>
      </Box>
      <Stack direction="column" mb="40px">
        <Box>{links}</Box>
      </Stack>
    </>
  );
};

export default SidebarContent;
