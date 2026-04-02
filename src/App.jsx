import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import DashboardPage from './pages/DashboardPage';
import awsExports from './aws-exports';

// this wires the frontend to the amplify resources created by the cli
Amplify.configure(awsExports);

// purpose of this theme is to force the authenticator into the app's monochrome look
const authTheme = {
  name: 'my-backend-dropbox-theme',
  tokens: {
    colors: {
      background: {
        primary: { value: '#0b0b0b' },
        secondary: { value: '#121212' },
        tertiary: { value: '#171717' },
      },
      font: {
        primary: { value: '#f5f5f5' },
        secondary: { value: '#b4b4b4' },
        tertiary: { value: '#7f7f7f' },
        interactive: { value: '#ffffff' },
      },
      brand: {
        primary: {
          10: { value: '#f2f2f2' },
          20: { value: '#ececec' },
          40: { value: '#dfdfdf' },
          60: { value: '#d2d2d2' },
          80: { value: '#c4c4c4' },
          90: { value: '#ededed' },
          100: { value: '#ffffff' },
        },
      },
      border: {
        primary: { value: 'rgba(255, 255, 255, 0.12)' },
        secondary: { value: 'rgba(255, 255, 255, 0.08)' },
      },
    },
    components: {
      authenticator: {
        router: {
          backgroundColor: { value: 'rgba(12, 12, 12, 0.96)' },
          borderColor: { value: 'rgba(255, 255, 255, 0.1)' },
          borderWidth: { value: '1px' },
          borderRadius: { value: '28px' },
          boxShadow: { value: '0 22px 80px rgba(0, 0, 0, 0.55)' },
        },
      },
      tabs: {
        item: {
          color: { value: '#9d9d9d' },
          _active: {
            color: { value: '#ffffff' },
            borderColor: { value: '#ffffff' },
          },
          _hover: {
            color: { value: '#ffffff' },
          },
        },
      },
      fieldcontrol: {
        backgroundColor: { value: 'rgba(255, 255, 255, 0.04)' },
        color: { value: '#f5f5f5' },
        borderColor: { value: 'rgba(255, 255, 255, 0.12)' },
        _focus: {
          borderColor: { value: 'rgba(255, 255, 255, 0.34)' },
        },
      },
      button: {
        primary: {
          backgroundColor: { value: '#f2f2f2' },
          color: { value: '#080808' },
          borderRadius: { value: '14px' },
          _hover: {
            backgroundColor: { value: '#ffffff' },
          },
        },
        link: {
          color: { value: '#d6d6d6' },
          _hover: {
            color: { value: '#ffffff' },
          },
        },
      },
    },
  },
};

function App() {
  return (
    <div className="app-shell">
      {/* this keeps a bit of motion behind the auth card without adding extra components */}
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="aurora aurora-three" />
      <ThemeProvider theme={authTheme} colorMode="dark">
        <Authenticator loginMechanisms={['email']}>
          {({ signOut, user }) => (
            <div className="app">
              <DashboardPage
                currentUser={{
                  id: user?.userId || '',
                  email: user?.signInDetails?.loginId || '',
                  username: user?.username || '',
                }}
                onSignOut={signOut}
              />
            </div>
          )}
        </Authenticator>
      </ThemeProvider>
    </div>
  );
}

export default App;
