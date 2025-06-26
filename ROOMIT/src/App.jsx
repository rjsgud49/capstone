import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import React from 'react';


import Header from './Components/Header';
import ScrollToTop from './Components/ScrollToTop';
import Notfound from './Pages/Notfound';
import Meeting from './Pages/Meeting';
import LivingSpace from './Pages/LivingSpace';
import Main from './Pages/Main';
import Login from './Pages/Login';
import MeetingDetail from './Pages/MeetingDetail';
import ChatRoom from './Pages/ChatRoom';
import MyPages from './Pages/MyPages';
import LivingSpaceDetail from './Pages/LivingSpaceDetail';
import IncreaseKakaoMap from './Components/IncreaseKakaoMap';
import Guide from './Pages/Guide.jsx';
import MypageEdit from './Pages/MypageEdit.jsx';
import LivingSpaceData from './Data/LivingSpaceData';
import AuthGuard from './Auth/AuthGuard';
import GuestGuard from './Auth/GuestGuard';

const AppContent = () => {
  const location = useLocation();
  const hideHeaderPaths = ['/login', '/logout'];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

  // ✅ currentUser 상태 추가
  const [currentUser, setCurrentUser] = React.useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ✅ accessToken 확인 후 currentUser 복구
  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('currentUser');

    if (token && !currentUser && savedUser) {
      console.log('🔄 currentUser 자동 복구');
      setCurrentUser(JSON.parse(savedUser));
    }
  }, [currentUser]);

  console.log('currentUser from App:', currentUser);

  return (
    <>
      {!shouldHideHeader && <Header currentUser={currentUser} />}
      <ScrollToTop />
      <div className="App">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={
            <GuestGuard>
              <Login setCurrentUser={setCurrentUser} />
            </GuestGuard>
          } />
          <Route path="/meeting" element={<Meeting />} />
          <Route path="/meeting/:id" element={<AuthGuard><MeetingDetail /></AuthGuard>} />
          <Route path="/housing" element={<LivingSpace />} />
          <Route path="/housing/:id" element={<LivingSpaceDetail />} />
          {/* <Route path="/housing/listing" element={<LivingSpaceListing />} /> */}
          <Route
            path="/housing/:id/map"
            element={<IncreaseKakaoMap LivingSpaceData={LivingSpaceData} />}
          />
          <Route path="/chat" element={<AuthGuard><ChatRoom /></AuthGuard>} />
          <Route path="/Guide" element={<Guide />} />
          <Route path="/chat/:roomId" element={<AuthGuard><ChatRoom /></AuthGuard>} />
          <Route path="/mypages" element={
            <AuthGuard>
              <MyPages currentUser={currentUser} updateUserData={setCurrentUser} />
            </AuthGuard>
          } />
          <Route path="/mypageEdit" element={
            <MypageEdit currentUser={currentUser}  updateUserData={setCurrentUser} />
          } />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
    </>
  );
};


const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
