import { useState } from "react";
import Home from "./Pages/Home/Home";
import Signup from "./Pages/SignIn/SignIn";
import LoaderNotificaiton from "./Component/Notification/LoaderNotification";






function App() {

  const [authenticate, setAuthenticate] = useState(false)
  const [notification,setNotification] = useState(false)

  const [inputError, setInputError] = useState({
    Username: "",
    Email: "",
    Phone: "",
    password: "",
    tempassword: "",
  });

  const AuthenticateUser = (action,name, password) => {
    setNotification(true)

    setTimeout(() => {
      setTimeout(() => {
        if(action=='signout') 
          {
            caches.keys().then(function(cacheNames) {
              cacheNames.forEach(function(cacheName) {
                caches.delete(cacheName);
              });
            });
            setNotification(false)
            return setAuthenticate(false)
            

          }
        if (name == 'XYXY')
          {
           if(password="12345")
           {
              setAuthenticate(true)
           }
           else
           {
              setInputError(inputError.password="Password invalid")
           }
          }
          else{
            console.log('invalid username')
            setInputError(inputError.Username="Username invalid")
          }
         
          setNotification(false)
      }, 200);
      
    
    }, 2300);    
    

  }



  return (
      <>
      <div className='dailyspend--main--app'>
      {notification && <LoaderNotificaiton />}

      {authenticate === true?
        <Home authenticate={AuthenticateUser} /> : <Signup authenticate={AuthenticateUser} inputError={inputError} />
      }
    </div >
     </>
    

  );
}

export default App;
