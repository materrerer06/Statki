
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCd2zfm-laB4KOgkfbD9LmakPRM3OQRGDk",
  authDomain: "gameproject-df49d.firebaseapp.com",
  projectId: "gameproject-df49d",
  storageBucket: "gameproject-df49d.appspot.com",
  messagingSenderId: "82731476035",
  appId: "1:82731476035:web:73fcd70ed9f1bcd83ce0f6",
  measurementId: "G-RDG1Y8GBSH"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export {app, auth};