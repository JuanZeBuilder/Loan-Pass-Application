import Dashboard from "views/Dashboard/Dashboard";
import LoanPass from "views/Dashboard/LoanPass";
import CorporateMemberships from "views/Dashboard/CorporateMemberships";
import CorporatePasses from "views/Dashboard/CorporatePasses";
import Templates from "views/Dashboard/Templates";
import SystemSettings from "views/Dashboard/SystemSettings";
import OutstandingFees from "views/Dashboard/OutstandingFees";

import Users from "views/Dashboard/Users";

import CardIssuance from "views/Dashboard/CardIssuance";
import SignIn from "views/Auth/SignIn.js";
import ForgotPassword from "views/Auth/ForgotPassword";
import SignUp from "views/Auth/SignUp.js";

import {
  HomeIcon,
  BriefCaseIcon,
  IdCardIcon,
  DocumentTextIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
  StatsIcon,
  CreditIcon,
  SupportIcon,
} from "components/Icons/Icons";
import { BiTransfer } from "react-icons/bi";

var dashRoutes = [
  {
    path: "/signin",
    name: "Sign In",
    icon: <DocumentIcon color="inherit" />,
    component: SignIn,
    layout: "/auth",
    redirect: true,
  },
  {
    path: "/forgotpassword",
    name: "Forgot Password",
    icon: <DocumentIcon color="inherit" />,
    component: ForgotPassword,
    layout: "/auth",
    redirect: true,
  },
  {
    path: "/signup",
    name: "Sign Up",
    icon: <RocketIcon color="inherit" />,
    component: SignUp,
    layout: "/auth",
    redirect: true,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/app",
    role: "",
  },
  {
    path: "/loanpass",
    name: "Loans",
    icon: <BriefCaseIcon color="inherit" />,
    component: LoanPass,
    layout: "/app",
    role: "",
  },
  {
    path: "/issuance",
    name: "Card Issuance",
    icon: <BiTransfer size={20} color="inherit" />,
    component: CardIssuance,
    layout: "/app",
    role: "GOP",
  },
  {
    name: "Corporate Pass",
    toggle: "Corporate Pass",
    icon: <IdCardIcon color="inherit" />,
    collapse: "pageCollapse",
    role: "Admin",
    views: [
      {
        path: "/memberships",
        name: "Memberships",
        component: CorporateMemberships,
        layout: "/app",
        role: "Admin",
      },
      {
        path: "/passes",
        name: "Passes",
        component: CorporatePasses,
        layout: "/app",
        role: "Admin",
      },
      {
        path: "/outstandingfees",
        name: "Outstanding Fees",
        component: OutstandingFees,
        layout: "/app",
        role: "Admin",
      },
    ],
  },
  {
    path: "/templates",
    name: "Templates",
    icon: <DocumentIcon color="inherit" />,
    component: Templates,
    layout: "/app",
    role: "Admin",
  },
  {
    path: "/configuration",
    name: "System Settings",
    icon: <SupportIcon color="inherit" />,
    component: SystemSettings,
    layout: "/app",
    role: "Admin",
  },
  {
    path: "/users",
    name: "Users",
    icon: <PersonIcon color="inherit" />,
    component: Users,
    layout: "/app",
    role: "Admin",
  },
];
export default dashRoutes;
