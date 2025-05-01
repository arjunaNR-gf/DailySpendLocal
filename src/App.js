import { useEffect, useState } from "react";
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
    Password: "",
    Tempassword: "",
    Text:""
  });

  useEffect(()=>{
    if(JSON.parse(sessionStorage.getItem('LoginStatus'))==='success')
    {
      setAuthenticate(true);
    }
  },[])

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
            sessionStorage.clear();
            setNotification(false)
            return setAuthenticate(false)
            

          }
        if (name == 'XYXY')
          {
           if(password="12345")
           {
            setInputError((prevState)=>({...prevState,Text:""}))
            sessionStorage.setItem('LoginStatus',JSON.stringify('success'))
              setAuthenticate(true)
           }
           else
           {
              setInputError((prevState)=>({...prevState,Text:"Password invalid"}))
           }
          }
          else{
            setInputError((prevState)=>({...prevState,Text:"Username invalid"}))
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
        <Home authenticate={AuthenticateUser} /> : <Signup authenticate={AuthenticateUser} inputErrordetails={inputError.Text} />
      }
    </div >
     </>
    

  );
}

export default App;
