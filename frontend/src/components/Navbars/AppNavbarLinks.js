// General imports
import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import routes from "routes.js";

// Chakra imports
import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import { ProfileIcon, SettingsIcon, ExitIcon } from "components/Icons/Icons";

import SidebarResponsive from "components/Sidebar/SidebarResponsive";

import { logout } from "../../slices/auth";
import EventBus from "../../common/EventBus";

export default function HeaderLinks(props) {
  const { variant, children, fixed, secondary, onOpen, ...rest } = props;

  // Chakra Color Mode
  let mainPrimary = useColorModeValue("#ff2b4e", "#ff2b4e");
  let inputBg = useColorModeValue("white", "gray.800");
  let mainText = useColorModeValue("gray.700", "gray.200");
  let navbarIcon = useColorModeValue("gray.500", "gray.200");
  let searchIcon = useColorModeValue("gray.700", "gray.200");

  if (secondary) {
    navbarIcon = "white";
    mainText = "white";
  }

  const history = useHistory();

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(async () => {
    await dispatch(logout());
    history.push("/auth/signin");
  }, [dispatch]);

  useEffect(() => {
    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  return (
    <Flex
      pe={{ sm: "0px", md: "16px" }}
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
    >
      <SidebarResponsive
        logoText={props.logoText}
        secondary={props.secondary}
        routes={routes}
        {...rest}
      />
      <Button
        ms="8px"
        px="0px"
        color={navbarIcon}
        variant="transparent-with-icon"
        leftIcon={<ExitIcon color={navbarIcon} w="22px" h="22px" me="0px" />}
        onClick={logOut}
      >
        <Text fontSize="xs" fontWeight="medium">
          Logout
        </Text>
      </Button>
    </Flex>
  );
}

HeaderLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};
