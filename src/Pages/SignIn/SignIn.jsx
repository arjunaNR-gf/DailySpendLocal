import { useEffect, useState } from "react";
import './index.css'
import InputPad from "../../Component/Input/InputPad";
import LoaderNotificaiton from "../../Component/Notification/LoaderNotification";

export default function Signup({ screen, authenticate, inputErrordetails }) {
  console.log(inputErrordetails)
  const [input, setInput] = useState({
    Username: "",
    Email: "",
    Phone: "",
    password: "",
    tempassword: "",
  });

  const [ErrorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    setErrorMsg(inputErrordetails)
  }, [ErrorMsg])


  const [changeBtn, setChangeBtn] = useState({
    btn: false,
    changeSignupScreen: false,
  });
  const [screenDisplay, setScreenDisplay] = useState(screen);

  const inputhandler = (e) => {
    const { name, value } = e.target;
    setInput((preVal) => ({ ...preVal, [name]: value }));
  };

  const onKeyDownForEnter = (e) => {
    if (e.code === 'Enter') {
      if (input.Username != '' && input.password != '') {
        AuthenticateUsr();
      }
    }
  }


  const [isNotification, setIsNotication] = useState(false);

  const isComplete = (type) => {
    setChangeBtn((prevState) => ({
      changeSignupScreen:
        input.Username != "" && input.Email != "" && input.Phone != "",
      btn: input.Username != "" && input.Email != "" && input.Phone != "",
    }));
  };

  const AuthenticateUsr = () => {
    authenticate('singin', input.Username, input.password)
  }

  const changeOnbordingsign = ({ authenticate }) => {
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
        <div >
          <div className="form-devider">
            <span className="form--name">
              <h1>Sign\Up</h1>
            </span>
          </div>
          <br></br>
          {changeBtn.changeSignupScreen == false && (
            <>
              <div className="form-devider signin">
                <InputPad
                  lable="Username"
                  type="text"
                  placeholder="Enter Username"
                  inputName="Username"
                  inputValue={input.Username}
                  inputhandler={inputhandler}
                />
              </div>

              <div className="form-devider signin">
                <InputPad
                  lable="Email "
                  placeholder="Enter Email"
                  type="text"
                  inputName="Email"
                  inputValue={input.Email}
                  inputhandler={inputhandler}

                />
                {inputError.Username && <span>{inputError.Username}</span>}

              </div>

              <div className="form-devider signin">
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
              <div className="form-devider signin">
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
        <div className="sign-in-main">
          <div className="form-devider">
            <span className="form--name">
              <div className="sign--logo--name"><h1>daily </h1><h1>Spend</h1></div>
              <h4>Sign\In</h4>
            </span>
          </div>

          {inputErrordetails && <div className="note">
            <span>{inputErrordetails}</span>
          </div>}

          <div className="form-devider">
            <InputPad
              lable="username"
              placeholder=" username"
              inputName="Username"
              inputValue={input.Username}
              inputhandler={inputhandler}
              onKeyDwn={onKeyDownForEnter}
            />
          </div>

          <div className="form-devider">
            <InputPad
              lable="password  "
              placeholder=" password"
              type="password"
              inputName="password"
              inputValue={input.password}
              inputhandler={inputhandler}
              onKeyDwn={onKeyDownForEnter}

            />
          </div>

          <br></br>


          <div className="form-devider btn-footer">
            <button onClick={() => AuthenticateUsr()} disabled={input.Username == "" && input.password == ""}>sign in</button>
          </div>
          <div className="form-link">
            <p>
              Don't have account?{" "}
              <a onClick={() => changeOnbordingsign("Signup")}>Sign/Up</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}