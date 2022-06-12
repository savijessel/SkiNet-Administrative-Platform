import { Route, Redirect } from "react-router-dom";
import NotFound from "../../pages/NotFound";

export const ProtectedRoute = ({ Component, session, ...rest }) => {
  if (session.logged_in()) {
    return <Route {...rest} render={() => <Component session={session} />} />;
  } else {
    return <Redirect to="/sign-in" />;
  }
};

export const AdminProtectedRoute = ({ Component, session, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() =>
        session.session_data().user_type === "SYSTEM_ADMIN" ? (
          <Component session={session} />
        ) : (
          <Route component={NotFound} />
        )
      }
    />
  );
};

export const HomeRoute = ({ Component, session, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() =>
        (() => session.logged_in()) ? (
          <Redirect to="/news" />
        ) : (
          <>
            <Component session={session} />
          </>
        )
      }
    />
  );
};

export const ProtectedLogin = ({ Component, session, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() =>
        (() => session.logged_in()) ? (
          <Component session={session} />
        ) : (
          <Redirect to="/roster/start" />
        )
      }
    />
  );
};
