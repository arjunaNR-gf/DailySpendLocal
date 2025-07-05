import { useEffect, useState } from "react";
import Home from "./Pages/Home/Home";
import Signup from "./Pages/SignIn/SignIn";
import LoaderNotificaiton from "./Component/Notification/LoaderNotification";






function App() {

  const [authenticate, setAuthenticate] = useState(false)
  const [notification, setNotification] = useState(false)


  const [inputError, setInputError] = useState({
    Username: "",
    Email: "",
    Phone: "",
    Password: "",
    Tempassword: "",
    Text: ""
  });

  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem('LoginStatus')) !== null) {
      if (JSON.parse(sessionStorage.getItem('LoginStatus')).status === '200K') {
        setAuthenticate(true);
      }
    }

  }, [])

  const AuthenticateUser = (action, name, password) => {
    setNotification(true)

    setTimeout(() => {
      setTimeout(() => {
        if (action == 'signout') {
          caches.keys().then(function (cacheNames) {
            cacheNames.forEach(function (cacheName) {
              caches.delete(cacheName);
            });
          });
          sessionStorage.clear();
          setNotification(false)
          return setAuthenticate(false)
        }

        //user and password validation
        validation_userNamePassword(name, password);
        setNotification(false)
      }, 200);


    }, 2300);
  }

  const validation_userNamePassword = (name, password) => {
    if (name == 'XY') {
      if (password = "123") {
        setInputError((prevState) => ({ ...prevState, Text: "" }))
        sessionStorage.setItem('LoginStatus', JSON.stringify({ username: name, status: '200K' }))
        setAuthenticate(true)
      }
      else {
        setInputError((prevState) => ({ ...prevState, Text: "Password invalid" }))
      }
    }
    else if (name == 'arjun042896@gmail.com') {
      if (password = "123") {
        setInputError((prevState) => ({ ...prevState, Text: "" }))
        sessionStorage.setItem('LoginStatus', JSON.stringify({ username: name, status: '200K' }))
        setAuthenticate(true)
      }
      else {
        setInputError((prevState) => ({ ...prevState, Text: "Password invalid" }))
      }
    }
    else {
      setInputError((prevState) => ({ ...prevState, Text: "Username invalid" }))
    }
  }



  return (
    <>
      <div className='dailyspend--main--app'>
        {notification && <LoaderNotificaiton type={'H'} />}

        {authenticate === true ?
          <Home authenticate={AuthenticateUser} /> : <Signup authenticate={AuthenticateUser} inputErrordetails={inputError.Text} />
        }
      </div >
    </>


  );
}

export default App;
