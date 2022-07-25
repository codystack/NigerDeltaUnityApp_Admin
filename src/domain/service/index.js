import { auth } from "../../data/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  // setPersistence,
  // browserSessionPersistence,
  setDoc,
  doc,
  db,
} from "../../data/firebase/";
// import { useSnackbar } from "notistack";

// export default function Service() {
//   const { enqueueSnackbar } = useSnackbar();
// }

export const createUser = async (email, pass) => {
  return await createUserWithEmailAndPassword(auth, email, pass);
};

export const signInUser = async (email, pass) => {
  // try {
  return await signInWithEmailAndPassword(auth, email, pass);
  // } catch (error) {
  //   console.log(error);
  // }
};

export const addCategory = async (id, name, image) => {
  // Add a new document in collection "cities"
  return await setDoc(doc(db, "categories", id), {
    id: id,
    name: name,
    url: image,
  });
  //   db.collection("categories").doc(id).set({
  //     id: id,
  //     name: name,
  //     url: image,
  //   });
};
