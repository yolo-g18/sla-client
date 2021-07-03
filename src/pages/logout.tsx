import { useSelector, useDispatch } from "react-redux";
import { RootStore } from "../utils/TypeScript";
import { logout as logoutUser } from "../redux/actions/authAction";
import { useEffect } from "react";

const logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
  });

  return <div>Logout</div>;
};

export default logout;
