import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  ShoppingCartIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  HomeModernIcon,
  PlayCircleIcon,
  BookmarkIcon,
  Bars3BottomLeftIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn } from "@/pages/auth";
import Products from "./pages/dashboard/products";
import Brands from "./pages/dashboard/brands";
import Categorys from "./pages/dashboard/categorys";
import SubCategorys from "./pages/dashboard/subCategorys";
import Colors from "./pages/dashboard/colors";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Users",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <ShoppingCartIcon {...icon} />,
        name: "products",
        path: "/products",
        element: <Products />,
      },
      {
        icon: <GlobeAltIcon {...icon} />,
        name: "brands",
        path: "/brands",
        element: <Brands />,
      },
      {
        icon: <BookmarkIcon {...icon} />,
        name: "categorys",
        path: "/categorys",
        element: <Categorys />,
      },
      {
        icon: <Bars3BottomLeftIcon {...icon} />,
        name: "sub categorys",
        path: "/sub-categorys",
        element: <SubCategorys />,
      },
      {
        icon: <PaintBrushIcon {...icon} />,
        name: "colors",
        path: "/colors",
        element: <Colors />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
    ],
  },
];

export default routes;
