import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewsDetail from './pages/NewsDetail';
import PlaceholderPage from './pages/PlaceholderPage';
import ContactPage from './pages/ContactPage';
import Login from './pages/Login';
import DashboardLayout from './pages/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import CourseList from './pages/CourseList';
import CourseDetail from './pages/CourseDetail';
import AthleteList from './pages/AthleteList';
import CoachList from './pages/CoachList';
import HomePagePicManage from './pages/dashboard/HomePagePicManage';
import BoardManage from './pages/dashboard/BoardManage';
import CourseManage from './pages/dashboard/CourseManage';
import IntroductionManage from './pages/dashboard/IntroductionManage';
import PathwayManage from './pages/dashboard/PathwayManage';
import NewsManage from './pages/dashboard/NewsManage';
import NavItemManage from './pages/dashboard/NavItemManage';
import AthleteManage from './pages/dashboard/AthleteManage';
import CoachManage from './pages/dashboard/CoachManage';
import IntentClientManage from './pages/dashboard/IntentClientManage';
import ContactInfoManage from './pages/dashboard/ContactInfoManage';
import EventManage from './pages/dashboard/EventManage';
import EventList from './pages/EventList';
import ClassSchedulePage from './pages/ClassSchedulePage';
import AwardManage from './pages/dashboard/AwardManage';
import AwardList from './pages/AwardList';
import ClassScheduleManage from './pages/dashboard/ClassScheduleManage';
import AdminManage from './pages/dashboard/AdminManage';
import './App.css';

const placeholderTitles = {
  class: 'Courses',
  event: 'Events',
  athlete: 'Athletes',
  coach: 'Coach',
  award: 'Awards',
  news: 'News',
  micro: 'Micro Class',
  peripheral: 'Merchandise',
  contact: 'Contact',
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/news" element={<PlaceholderPage title={placeholderTitles.news} />} />
        <Route path="/class" element={<CourseList />} />
        <Route path="/class/:slug" element={<CourseDetail />} />
        <Route path="/class-schedule" element={<ClassSchedulePage />} />
        <Route path="/event" element={<EventList />} />
        <Route path="/athlete" element={<AthleteList />} />
        <Route path="/coach" element={<CoachList />} />
        <Route path="/award" element={<AwardList />} />
        <Route path="/micro" element={<PlaceholderPage title={placeholderTitles.micro} />} />
        <Route path="/peripheral" element={<PlaceholderPage title={placeholderTitles.peripheral} />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="homepagepic" element={<HomePagePicManage />} />
          <Route path="boards" element={<BoardManage />} />
          <Route path="introductions" element={<IntroductionManage />} />
          <Route path="pathways" element={<PathwayManage />} />
          <Route path="news" element={<NewsManage />} />
          <Route path="events" element={<EventManage />} />
          <Route path="awards" element={<AwardManage />} />
          <Route path="navitems" element={<NavItemManage />} />
          <Route path="courses" element={<CourseManage />} />
          <Route path="classes" element={<ClassScheduleManage />} />
          <Route path="athletes" element={<AthleteManage />} />
          <Route path="coaches" element={<CoachManage />} />
          <Route path="intentclients" element={<IntentClientManage />} />
          <Route path="contactinfo" element={<ContactInfoManage />} />
          <Route path="admins" element={<AdminManage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
