import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyD802QhudyPiDOtS06cRtCiNCfOX7peCbI",
    authDomain: "cookingclassicsanywhere.firebaseapp.com",
    databaseURL: "https://cookingclassicsanywhere.firebaseio.com",
    projectId: "cookingclassicsanywhere",
    storageBucket: "cookingclassicsanywhere.appspot.com",
    messagingSenderId: "1090291574415",
    appId: "1:1090291574415:web:bfc0e034c8dcd5141db2fa"
  };

  const firebaseData = firebase.initializeApp(firebaseConfig);
  export default firebaseData;