import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

export const PrivateRouteDashboard = ({ children, ...rest }) => {
  const { userData } = useSelector((state) => state.user);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (userData) {
          return children;
        } else {
          return (
            <Redirect to={{ pathname: "/login", state: { from: location } }} />
          );
        }
      }}
    />
  );
};

export const PrivateRouteLogin = ({ children, ...rest }) => {
  // const userType = localStorage.getItem('userType');
  const { userData } = useSelector((state) => state.user);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!userData) {
          return children;
        } else {
          return (
            <Redirect
              to={{ pathname: "/admin/dashboard", state: { from: location } }}
            />
          );
        }
      }}
    />
  );
};

export const PrivateRouteSignup = ({ children, ...rest }) => {
  // const userType = localStorage.getItem('userType');
  const { userData } = useSelector((state) => state.user);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!userData) {
          return children;
        } else {
          return (
            <Redirect
              to={{ pathname: "/admin/dashboard", state: { from: location } }}
            />
          );
        }
      }}
    />
  );
};
