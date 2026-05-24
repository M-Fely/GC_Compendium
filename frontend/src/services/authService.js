import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../firebase";

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, provider);

  const user = result.user;

  const token = await user.getIdToken();

  return {
    token,
    email: user.email,
    name: user.displayName,
    photo: user.photoURL,
  };
};

export const logoutUser = async () => {
  await signOut(auth);

  localStorage.removeItem("token");
};
