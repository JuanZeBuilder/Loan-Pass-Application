// General imports
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import UserService from "../../../services/user.service.js";
import AdminService from "../../../services/admin.service.js";

// Chakra imports
import {
  Box,
  Flex,
  Grid,
  Image,
  SimpleGrid,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";

// Custom components
import { dashboardData, loanData } from "variables/general";
import WelcomeOverview from "./components/WelcomeOverview.js";
import LoansOverview from "./components/LoansOverview.js";
import CreateModal from "./components/CreateModal.js";
import LineChart from "components/Charts/LineChart.js";
import LoansStats from "./components/LoansStats.js";
import BorrowersStats from "./components/BorrowersStats.js";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [content, setContent] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [monthlyLoanStatistics, setMonthlyLoanStatistics] = useState([]);
  const [monthlyBorrowerStatistics, setMonthlyBorrowerStatistics] = useState(
    []
  );

  const [refresh, setRefresh] = useState(0);

  const { user: currentUser } = useSelector((state) => state.auth);

  const refreshData = () => {
    setRefresh(refresh + 1);
  };

  useEffect(() => {
    if (currentUser) {
      setIsAdmin(currentUser.roles.includes("ROLE_ADMIN"));
    } else {
      setIsAdmin(false);
    }

    fetchStatistics();
    fetchAttractions();
    fetchLoans();
  }, [refresh]);

  const fetchLoans = () => {
    setIsLoading(true);

    UserService.getLoans().then(
      (response) => {
        const filteredData = response.data.data
          .filter(
            (response) =>
              response.status != "returned" && response.status != "cancelled"
          )
          .sort(function compare(a, b) {
            let dateA = new Date(a.loanPassDate);
            let dateB = new Date(b.loanPassDate);

            return dateB - dateA;
          });
        setContent(filteredData);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        setIsError(true);
        setContent([]);

        console.log(error);
      }
    );
  };

  const fetchAttractions = () => {
    setIsLoading(true);

    UserService.getCorporatePasses().then(
      (response) => {
        const attractionsList = _(response.data.data)
          .groupBy((item) => item.membershipName)
          .map((value, key) => {
            return value[0].attraction;
          })
          .value();

        setAttractions(attractionsList);
        setIsLoading(false);
      },
      (error) => {
        setContent([]);
        setIsLoading(false);

        console.log(error);
      }
    );
  };

  const fetchStatistics = () => {
    setIsLoading(true);

    AdminService.getMonthlyLoanStatistics().then(
      (response) => {
        setMonthlyLoanStatistics([
          {
            name: "Loans",
            data: response.data.data,
          },
        ]);
      },
      (error) => {
        console.log(error);
      }
    );

    AdminService.getMonthlyBorrowerStatistics().then(
      (response) => {
        setMonthlyBorrowerStatistics([
          {
            name: "Borrowers",
            data: response.data.data,
          },
        ]);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        console.log(error);
      }
    );
  };

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      {isLoading ? (
        <Flex justifyContent="center" marginTop={5}>
          <Spinner color="red.500" size="xl" />
        </Flex>
      ) : (
        <Box>
          <Grid
            templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "2fr 1.2fr" }}
            templateRows={{ sm: "1fr", md: "1fr", lg: "1fr" }}
            gap="24px"
            mb="26px"
          >
            <WelcomeOverview
              username={currentUser.username}
              firstName={currentUser.firstName}
              lastName={currentUser.lastName}
            />
            <LoansOverview
              title={"Current Loans"}
              createItem={
                <CreateModal attractions={attractions} refresh={refreshData} />
              }
              data={content}
              refresh={refreshData}
            />
          </Grid>
          {isAdmin ? (
            <Grid
              templateColumns={{ sm: "1fr", lg: "1.5fr 1.5fr" }}
              templateRows={{ sm: "repeat(2, 1fr)", lg: "1fr" }}
              gap="24px"
            >
              <BorrowersStats
                title={"No. of Loans"}
                percentage={3}
                chart={<LineChart lineData={monthlyLoanStatistics} />}
              />
              <LoansStats
                title={"No. of Borrowers"}
                percentage={10}
                chart={<LineChart lineData={monthlyBorrowerStatistics} />}
              />
            </Grid>
          ) : (
            ""
          )}
        </Box>
      )}
    </Flex>
  );
}
