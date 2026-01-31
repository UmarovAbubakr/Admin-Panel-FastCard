import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { jwtDecode } from "jwt-decode";
import { getUserById } from "@/api/getJwt/getJwt";
import { URL } from "@/utils/url";

export function Profile() {
  const { data, loading, error } = useSelector((store) => store.jwt);
  const token = localStorage.getItem('token');
  const decoded = token ? jwtDecode(token) : null;
  const dispatch = useDispatch();

  useEffect(() => {
    if (decoded?.sid) {
      dispatch(getUserById(decoded.sid));
    }
  }, [dispatch, decoded?.sid]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <Card className="mx-auto mt-8 w-full max-w-sm border border-blue-gray-100 shadow-xl">
      <CardBody className="p-6">
        <div className="flex flex-col items-center text-center">
          <Avatar
            src={URL + `/images/${data.image}`}
            alt="profile"
            size="xxl"
            className="border-4 border-white shadow-lg"
          />

          <div className="mt-4">
            <Typography variant="h4" color="blue-gray" className="font-bold">
              {data.firstName} {data.lastName}
            </Typography>
            <Typography
              variant="paragraph"
              className="font-medium text-blue-gray-600 mt-1"
            >
              CEO / Co-Founder
            </Typography>
          </div>

          <div className="mt-6 w-full space-y-4">
            <div className="flex justify-between items-center">
              <Typography className="font-normal text-blue-gray-500">
                Email:
              </Typography>
              <Typography className="font-medium">
                {data.email}
              </Typography>
            </div>

            <div className="flex justify-between items-center">
              <Typography className="font-normal text-blue-gray-500">
                Roles:
              </Typography>
              <Typography className="font-medium">
                {data.userName}
              </Typography>
            </div>

            <div className="flex justify-between items-center">
              <Typography className="font-normal text-blue-gray-500">
                Dob:
              </Typography>
              <Typography className="font-medium">
                {data.dob}
              </Typography>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-blue-gray-100 w-full">
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Social Links
            </Typography>
            <div className="flex justify-center gap-6">
              <i className="fa-brands fa-twitter text-blue-400 text-xl cursor-pointer hover:scale-110 transition-transform" />
              <i className="fa-brands fa-linkedin text-blue-700 text-xl cursor-pointer hover:scale-110 transition-transform" />
              <i className="fa-brands fa-github text-gray-800 text-xl cursor-pointer hover:scale-110 transition-transform" />
              <i className="fa-brands fa-instagram text-pink-600 text-xl cursor-pointer hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default Profile;