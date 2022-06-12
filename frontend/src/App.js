import React, { Component, useState, useEffect } from "react";
import { Link, BrowserRouter as Router, Switch, Route } from "react-router-dom";
import axios from "axios";

import { ProtectedRoute, HomeRoute, ProtectedLogin, AdminProtectedRoute } from "./components/App/ProtectedRoutes";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import SignIn from "./pages/SignIn/SignIn";
import Roster from "./pages/Roster/Roster";
import UserPage from "./pages/User/UserPage.js";
import OtherUserPage from "./pages/User/OtherUserPage.js";
import UserProfileEdit from "./pages/Personnel/UserProfileEdit";

import AdminLookupsPage from "./pages/Admin/Lookups";

import Session from "./services/SessionService";
import UsersListPage from "./pages/Personnel/Personnel";
import Reports from "./pages/Personnel/Reports/Reports";
import RosterPlanner from "./pages/Roster/RosterPlanner";
import AreasPage from "./pages/Admin/Areas";
import NewsBulletinPage from "./pages/News/NewsBulletinPage";
import CreateNewsPost from "./pages/News/CreateNewsPost";
import SinglePostPage from "./pages/News/SinglePostPage";
import NotFound from "./pages/NotFound";
import SignUpPage from "./pages/SignUp/SignUpPage";



class App extends Component {
  constructor(props) {
    super(props);
    this.session = new Session();
  }

  render = () => {
    return (
      <Router>
        <Header session={this.session} />
        <Switch>
          <ProtectedRoute path="/roster/calendar" Component={RosterPlanner} session={this.session} />
          

          <ProtectedRoute path="/roster/calendar" Component={RosterPlanner} session={this.session} />

          <ProtectedRoute path="/user" Component={UserPage} session={this.session} />

          <AdminProtectedRoute exact path="/news/create" Component={CreateNewsPost} session={this.session} />

          <ProtectedRoute exact path="/news/view/:postId" Component={SinglePostPage} session={this.session} />

          <ProtectedRoute path="/news" Component={NewsBulletinPage} session={this.session} />

          <ProtectedRoute path="/personnel/users" Component={UsersListPage} session={this.session} />

          <AdminProtectedRoute path="/admin/lookups" Component={AdminLookupsPage} session={this.session} />

          <AdminProtectedRoute path="/admin/newUser" Component={SignUpPage} session={this.session} />

          <ProtectedRoute path="/personnel/user/:id" Component={UserProfileEdit} session={this.session} />

          <AdminProtectedRoute path="/personnel/reports" Component={Reports} session={this.session} />

          {/* Can access if they Are NOT Signed in */}
          <ProtectedLogin path="/sign-in" Component={SignIn} session={this.session} />

          {/* Unprotected Can Access by Anyone */}
          <Route path="/sign-up" component={SignUpPage} session={this.session}/>
          <HomeRoute exact path="/" Component={Home} session={this.session} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </Router>
    );
  };
}

export default App;
