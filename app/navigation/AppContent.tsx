import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'app/redux/rootReducer';
import RootNav from 'app/navigation/RootNav';
import AuthNavigator from 'app/components/login/AuthNavigator';

export default function AppContent() {
  const authData = useSelector((state: RootState) => state.auth.authData);

  // If authData is null => user is logged out => show AuthNavigator
  // Otherwise => user is logged in => show RootNav
  if (!authData) {
    return <AuthNavigator />;
  }

  return <RootNav />;
}
