import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Loader from './components/Loader';
import Login from './screens/Login';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import { loadCurrentUser } from './utils/user';
import { setLoading } from './utils/loadingState';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import screens from './screens';
import Layout from './components/Layout';
import { User } from './types';
import NotFound from './screens/NotFound';

const App:React.FC = () => {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    onAuthStateChanged(auth, result => {
      if(result) {
        loadCurrentUser().then(result => {
          if (!result || result.deleted) {
            auth.signOut();
            return;
          }
          setUser(result)
          setLogged(true);
        }).finally(() => {
          setLoading(false)
        });
      } else {
        setLogged(false)
        setLoading(false)
      }
    })
  }, []);

  const logOut = () => {
    signOut(auth);
  }

  return (
    <BrowserRouter>
      <Loader/>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT}/>
      {!logged ? (
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='*' element={<Navigate to='/' replace />}/>
        </Routes>
      ) : (
        <>
          <Layout {...{logOut}}>
            <Routes>
              {screens.filter(screen => screen.onlyAdmin ? user?.admin : true).map((screen, index) => (
                <Route
                  key={index}
                  path={screen.path}
                  element={screen.component}
                />
              ))}
              <Route
                path='*'
                element={<NotFound/>}
              />
            </Routes>
          </Layout>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
