import { useState } from "react";
import './index.css'
import InputPad from "../../Component/Input/InputPad";
import LoaderNotificaiton from "../../Component/Notification/LoaderNotification";

export default function Signup({ screen,authenticate }) {
    const [input, setInput] = useState({
      Username: "",
      Email: "",
      Phone: "",
      password: "",
      tempassword: "",
    });
    const [changeBtn, setChangeBtn] = useState({
      btn: false,
      changeSignupScreen: false,
    });
    const [screenDisplay, setScreenDisplay] = useState(screen);

    const inputhandler = (e) => {
      const { name, value } = e.target;
      setInput((preVal) => ({ ...preVal, [name]: value }));
      console.log(input.Username);
    };
  
    const [isNotification, setIsNotication] = useState(false);
  
    const isComplete = (type) => {
      setChangeBtn((prevState) => ({
        changeSignupScreen:
          input.Username != "" && input.Email != "" && input.Phone != "",
        btn: input.Username != "" && input.Email != "" && input.Phone != "",
      }));
    };

    const AuthenticateUsr=()=>{
        authenticate('singin',input.Username,input.password)
    }
  
    const changeOnbordingsign = ({authenticate}) => {
      setIsNotication(true);
      setTimeout(() => {
        setIsNotication(false);
        setInput({
          Username: "",
          Email: "",
          Phone: "",
          password: "",
          tempassword: "",
        });
        
      }, 2500);
    };
  
    return (
      <>
        {isNotification ? <LoaderNotificaiton /> : ""}
        {screenDisplay == "Signup" ? (
          <div className="onboard--page--main">
            <div className="form-devider">
              <span className="form--name">
                <h1>Sign\Up</h1>
              </span>
            </div>
            <br></br>
            {changeBtn.changeSignupScreen == false && (
              <>
                <div className="form-devider">
                  <InputPad
                    lable="Username"
                    type="text"
                    placeholder="Enter Username"
                    inputName="Username"
                    inputValue={input.Username}
                    inputhandler={inputhandler}
                  />
                </div>
  
                <div className="form-devider">
                  <InputPad
                    lable="Email "
                    placeholder="Enter Email"
                    type="text"
                    inputName="Email"
                    inputValue={input.Email}
                    inputhandler={inputhandler}
                  />
                </div>
  
                <div className="form-devider">
                  <InputPad
                    lable="Phone  "
                    placeholder="Enter Phone Number"
                    inputName="Phone"
                    inputValue={input.Phone}
                    inputhandler={inputhandler}
                  />
                </div>
              </>
            )}
  
            {changeBtn.changeSignupScreen == true && (
              <>
                <div className="form-devider">
                  <InputPad
                    lable=" Password  "
                    placeholder="Enter Password"
                    type="password"
                    inputName="password"
                    inputValue={input.password}
                    inputhandler={inputhandler}
                  />
                </div>
                <div className="form-devider">
                  <InputPad
                    lable="Confirm Password  "
                    placeholder="confirm password"
                    type="password"
                    inputName="tempassword"
                    inputValue={input.tempassword}
                    inputhandler={inputhandler}
                  />
                </div>
              </>
            )}
  
            <br></br>
            <br></br>
            <div className="form-devider btn-footer">
              <button onClick={() => isComplete()}>
                {changeBtn.btn == false ? "Continue.. " : "Create Account"}
              </button>
              <div className="form-link">
                <p>
                  Don't have account?{" "}
                  <a onClick={() => changeOnbordingsign("signin")}>Sign-In</a>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="onboard--page--main">
            <div className="form-devider">
              <span className="form--name">
                <h1>Sign\In</h1>
              </span>
            </div>
            <br></br>
            <br></br>
  
            <div className="form-devider">
              <InputPad
                lable="Username"
                placeholder="Enter Username"
                inputName="Username"
                inputValue={input.Username}
                inputhandler={inputhandler}
              />
            </div>
  
            <div className="form-devider">
              <InputPad
                lable=" Password  "
                placeholder="Enter Password"
                type="password"
                inputName="password"
                inputValue={input.password}
                inputhandler={inputhandler}
              />
            </div>
  
            <br></br>
            <br></br>
            <br></br>
  
            <div className="form-devider btn-footer">
              <button onClick={()=>AuthenticateUsr()} disabled={input.Username=="" && input.password == ""}>sign in</button>
            </div>
            <div className="form-link">
              <p>
                Don't have account?{" "}
                <a onClick={() => changeOnbordingsign("Signup")}>Sign-Up</a>
              </p>
            </div>
          </div>
        )}
      </>
    );
  }