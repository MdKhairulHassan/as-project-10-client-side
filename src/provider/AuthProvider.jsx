import { useEffect, useState } from 'react';
import app from '../firebase/firebase.config';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  // updateEmail,
  updateProfile,
} from 'firebase/auth';

// export const AuthContext = createContext();
import { AuthContext } from './AuthContext';

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  console.log(loading, user);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUser = updatedData => {
    return updateProfile(auth.currentUser, updatedData);
  };

  // const updateUserEmail = updatedData => {
  //   return updateEmail(auth.currentUser, updatedData);
  // };

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      // token validation by using localstorage ==============
      // if (currentUser) {
      //   const loggedUser = { email: currentUser.email };
      //   fetch('http://localhost:3000/getToken', {
      //     method: 'POST',
      //     headers: {
      //       'content-type': 'application/json',
      //     },
      //     body: JSON.stringify(loggedUser),
      //   })
      //     .then(res => res.json())
      //     .then(data => {
      //       console.log('after getting token', data);
      //       localStorage.setItem('token', data.token);
      //     });
      // } else {
      //   localStorage.removeItem('token');
      // }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authData = {
    user,
    setUser,
    createUser,
    logIn,
    logOut,
    loading,
    setLoading,
    updateUser,
    // updateUserEmail,
    googleSignIn,
  };
  return <AuthContext value={authData}>{children}</AuthContext>;
};

export default AuthProvider;
