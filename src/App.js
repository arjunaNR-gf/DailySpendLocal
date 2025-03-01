import { useState } from "react";
import Home from "./Pages/Home/Home";
import Signup from "./Pages/SignIn/SignIn";
import LoaderNotificaiton from "./Component/Notification/LoaderNotification";






function App() {

  const [authenticate, setAuthenticate] = useState(false)
  const [notification,setNotification] = useState(false)

  const AuthenticateUser = (action,name, password) => {
    setNotification(true)

    setTimeout(() => {
      setTimeout(() => {
        if(action=='action') 
          {
            return setAuthenticate(false)
          }
        if (name == 'arjun042896@gmail.com' && password == 'Arjun@1996')
          {
            console.log('hello')
            setAuthenticate(true)
            
          }
          else
          {
            console.log('unsuccessful!')
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
        <Home authenticate={AuthenticateUser} /> : <Signup authenticate={AuthenticateUser} />
      }
    </div >
      </>
    

  );
}

export default App;
