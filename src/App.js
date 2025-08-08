import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login/page';
import ForgetPassword from './components/forgot-password/page';
import Profile from './components/profile/page';
import EditProfile from './components/edit-profile/page';
import AllPosts from './components/all-posts/page';
import Editfeed from './components/edit-feed/page';
import AllUsers from './components/all-users/page';
import AddArticle from './components/addArticle/page';
import AddVideo from './components/add-video/page';
import AddCharts from './components/add-charts/page';
import AddTweet from './components/addTweet/page';
import DashboardLayout from './DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import BitcoinPrice from './components/bitcoin-price/page';
import BitcoinHistory from './components/bitcoin-history/page';
import AddNoster from './components/add-noster/page';
import MainFeedDesc from './components/mainFeedDesc/page';
import SendEmail from './components/send-email/page';
import AddAudios from './components/add-audio/page';
import Categories from './components/category/page';
import ResourceLinks from './components/add-Resourcelinks/page';
import AddBlog from './components/add-blogs/page';
import Signup from './components/signup/page';
import ChangePassword from './components/ChangePassword/page';
import ImportUserPosts from './components/add-Posts-Excel/page';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />


        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<AllPosts />} />
            <Route path="all-posts" element={<AllPosts />} />
            <Route path="edit-feed" element={<Editfeed />} />
            <Route path="all-users" element={<AllUsers />} />
            <Route path="send-email" element={<SendEmail />} />
            <Route path="add-article" element={<AddArticle />} />
            <Route path="add-video" element={<AddVideo />} />
            <Route path="add-audio" element={<AddAudios />} />
            <Route path="add-category" element={<Categories />} />
            <Route path="add-resourceLinks" element={<ResourceLinks />} />
            <Route path="add-blog" element={<AddBlog />} />
            <Route path="add-tweet" element={<AddTweet />} />
            <Route path="add-charts" element={<AddCharts />} />
            <Route path="add-noster" element={<AddNoster />} />
            <Route path="bitcoin-price" element={<BitcoinPrice />} />
            <Route path="bitcoin-history" element={<BitcoinHistory />} />
            <Route path="main-feed-desc" element={<MainFeedDesc />} />
            <Route path="profile" element={<Profile />} />
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="add-posts-excel" element={<ImportUserPosts />} />

          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
