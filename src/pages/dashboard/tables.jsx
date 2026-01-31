import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUser } from "@/api/getJwt/getJwt";

export function Tables() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((store) => store.jwt);

  let usersArray = [];

  if (user) {
    if (Array.isArray(user)) {
      usersArray = user;
    } else if (user.users && Array.isArray(user.users)) {
      usersArray = user.users;
    } else if (user.data && Array.isArray(user.data)) {
      usersArray = user.data;
    } else if (user.items && Array.isArray(user.items)) {
      usersArray = user.items;
    } else if (typeof user === 'object') {
      usersArray = [user];
    }
  }

  console.log("User data:", user);
  console.log("Users array:", usersArray);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardBody className="flex justify-center items-center h-64">
            <Typography variant="h6" color="blue-gray">
              Loading users...
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardBody className="flex justify-center items-center h-64">
            <Typography variant="h6" color="red">
              Error: {error}
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (usersArray.length === 0) {
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardBody className="flex justify-center items-center h-64">
            <Typography variant="h6" color="blue-gray">
              No users found
            </Typography>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Users Table ({usersArray.length} users)
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["ID", "Avatar", "Name", "Email", "Phone", "Roles"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usersArray.map((item, key) => {
                const className = `py-3 px-5 ${key === usersArray.length - 1
                  ? ""
                  : "border-b border-blue-gray-50"
                  }`;

                return (
                  <tr key={item.id || key}>
                    <td className={className}>
                      <Typography
                        variant="small"
                        className="font-mono text-xs"
                      >
                        {`#${key + 1}`}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Avatar
                        src={URL + `/images/${item.image}`}
                        alt={item.name}
                        size="sm"
                        variant="rounded"
                      />
                    </td>
                    <td className={className}>
                      <div>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-semibold"
                        >
                          {item.firstName || 'No Name'}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {item.email || 'No Email'}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {item.phoneNumber || "No Phone Number"}
                      </Typography>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {item.userRoles && item.userRoles.map((role) => (
                          <Chip
                            key={role.id}
                            value={role.name}
                            className={`text-xs font-bold py-1 px-3 rounded-full ${role.name === 'Admin'
                                ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200'
                                : role.name === 'Manager'
                                  ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200'
                                  : role.name === 'User'
                                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200'
                                    : 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200'
                              }`}
                          />
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Tables;