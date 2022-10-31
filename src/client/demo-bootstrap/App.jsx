import React from 'react';
import { AuthProvider } from './hooks/useAuth';
import LoginController from './controllers/LoginController';
import PagesController from './controllers/PagesController';
import MemberPages from './pages/MemberPages';
import { buildBottomNav } from './components/BottomNav';
import { buildTopNav } from './components/TopNav';
import LoginPage from './pages/LoginPage';
import RegistPage from './pages/RegistPage';
import SimpleLoading from './components/SimpleLoading';

import './App.css';

const onPageChanged = ({ page, goPage, logout }) => {
  if (page.action === 'logout') {
    logout();
  } else {
    goPage(page);
  }
};

const App = () => {
  return (
    <AuthProvider>
      <SimpleLoading>
        <LoginController submitForm={<LoginPage />} registForm={<RegistPage />}>
          <PagesController
            pages={MemberPages}
            initPage={MemberPages.home}
            buildTopNavigator={buildTopNav}
            buildBottomNavigator={buildBottomNav}
            onPageChanged={onPageChanged}
          />
        </LoginController>
      </SimpleLoading>
    </AuthProvider>
  );
};

export default App;
