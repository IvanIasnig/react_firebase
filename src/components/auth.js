import { auth, googleProvider } from "../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useState } from "react";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  if(auth.currentUser) {
    console.log(auth.currentUser.email);
} else {
    console.log('No user is currently logged in');
}


  return (
<div className="card p-4 mb-4">
  <div className="form-group">
    <input
      className="form-control m-2"
      placeholder="Email..."
      onChange={(e) => setEmail(e.target.value)}
    />
  </div>
  <div className="form-group">
    <input
      className="form-control m-2"
      placeholder="Password..."
      type="password"
      onChange={(e) => setPassword(e.target.value)}
    />
  </div>
  <button className="btn btn-primary m-2" onClick={signIn}> Sign In</button>

  <button className="btn btn-info m-2" onClick={signInWithGoogle}> Sign In With Google</button>

  <button className="btn btn-danger m-2" onClick={logout}> Logout </button>
</div>

  );
};
