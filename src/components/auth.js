import {auth} from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth,email,password);
}

export const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const logOut = () => {
    // eslint-disable-next-line no-undef
    return signOut(auth);
}