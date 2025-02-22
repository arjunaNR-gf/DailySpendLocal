import './App.css';
import './AppMobile.css'
import { useEffect, useState } from 'react';
import { getLastUpdateDailySpend, pushSpendMoney } from './ServiceForBackEnd/Api/DailySpendLocalApi';
import { app } from './ServiceForBackEnd/FireBaseConfig/Configuration';
import { getDatabase, push, ref, set, get, remove } from 'firebase/database';
import { FB_API, Get_sync } from './ServiceForBackEnd/FireBaseConfig/FirebaseService';
import Dropdown from './Component/Dropdown/Dropdown'
import PayUpdate from './Pages/Payment/PayUpdate';
import ProfilePage from './Pages/Profile/ProfilePage';





function App() {

  const [btnText, setBtnText] = useState('NEXT..')
  const [inputText, setInputText] = useState('date')
  const [inputID, setInputId] = useState('byDate')
  const [inputPlaceHolder, setPlaceHolder] = useState('Enter The' + inputID + '....')
  const [item, setItem] = useState({ paymentDate: '', Item_Name: '', Spent_Price: '' })

  const [notification, setNotification] = useState({ activeStatus: false, subject: '' })
  const [innerNavigationFlag, setinnerNavigationFlag] = useState("paymentDate")


  const [localDB, setLocalDb] = useState([])

  const [pushMenu, setPushMenu] = useState('payment')
  const [paymentMenu, setPaymentMenu] = useState([])

  const [lastupdateInfo, setLastUpdateInfo] = useState('')
  const [profileData, setProfileData] = useState([])



  const [profileView, setProfileView] = useState({ selectedYear: '', selectedMonth: '', ViewData: [] })



//used to fecth data for view menu
  async function asyncgetOnlineStoreData() {
    const db = getDatabase(app)
    const filepath = ref(db, FB_API.payment_Address)
    const getData = await get(filepath)
    if (getData.exists()) {
      const tempDB = getData.val()
      setLocalDb(
        (Object.keys(tempDB).map(id => {
          return { ...tempDB[id], PayID: id }
        })).sort(function (a, b) {
          return new Date(a.paymentDate) - new Date(b.paymentDate);
        })
      )
    }
  }
  const DailySpendInfo_fun = async () => {
  }


  const firebaseFetchProfile = async () => {
    const db = getDatabase(app);
    const dbRef = ref(db, FB_API.profile_Address)
    const getData = await get(dbRef)
    if (getData.exists()) {
      const tempDB = getData.val()
      const tempData = Object.keys(tempDB).map((key, i) => {
        return { ...tempDB[key] }
      })
      setProfileData(Object.keys(tempData[0]).map((key, i) => {
        return { ...tempData[0][key] }
      }))
      !inputval_flag() && ProfileViewLoad();
    }
    DailySpendInfo_fun()
  }



  const ProfileViewLoad = () => {
    if (pushMenu != "payment") {
      const monthTest = [
        "JAN", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
      ]
      const orrangedAry = [];
      profileData.map((item, i) => {
        if (item.month != 'year' && item.year == inputval.year) {
          orrangedAry[monthTest.indexOf(item.month)] = item.month
        }
      }
      )

      setBtnText('serach')
      // const monthtest = []
      inputval.year == '' ?
        setProfileView({ ViewData: Array.from(new Set(profileData.map((item, i) => { return item.year }))) })
        :
        setProfileView({ ViewData: orrangedAry })
      //  console.log(profileData.map((item) => { if (item.year == inputval.year) {return item.month} }),'heloo')
      // monthtest[profileData.map((item) => { if (item.year == inputval.year) { item.month} })] =
      // profileData.map((item) => { if (item.year == inputval.year) { item.month} })
      //   console.log(monthtest,'ghhgg')
    }

  }


 



  const PaymentMenu_Sync = async () => {
    const dbData = await Get_sync(FB_API.paymentList_Address)
    if (dbData.exists()) {
      const tempData = dbData.val()
      const tempAry = Object.keys(tempData).map(key => {
        return { ...tempData[key] }
      })

      setPaymentMenu(Object.keys(tempAry[0]).map(key => {
        return { ...tempAry[0][key] }
      }))
    }
    else {
      console.log('0')
    }

    // const data = await get_Firebase_sync(PaymenuListDetailsAdd)


    //   const tempDB = data.val()
    //   const tempData = Object.values(tempDB).map((key, i) => { return{tempDB} })
    //   console.log(tempData,'tempdata...')
  }


  useEffect(() => {
    getLastUpdateDailySpend().then(res => {
      setLastUpdateInfo(res.data)
    }).catch((error) => {
      if (error.message === 'ERR_NETWORK') {
        setLastUpdate('offline')
      }
      else {
        setLastUpdate('server offline')
      }
    }).catch((error) => {
      if (error.message === 'ERR_NETWORK') {
        setLastUpdate('offline')
      }
      else {
        console.log(error)
      }
    })
  }, [])






  useEffect(() => {
    asyncgetOnlineStoreData();
    PaymentMenu_Sync();
    firebaseFetchProfile();
  }, [asyncgetOnlineStoreData, PaymentMenu_Sync, firebaseFetchProfile])

  const changePushMenu = (menuName) => {
    setPushMenu(menuName)
    if (menuName == 'profile') {
      firebaseFetchProfile();
    } else {
      asyncgetOnlineStoreData()
    }
  }

  

  const swith_input = () => {
    let txt = ''
    if (item.paymentDate == txt) {
      setItem((prevSte) => ({
        ...prevSte, paymentDate: fetch_input_val()
      }))
      setTimeout(() => {
        Change_Context('Enter The Item', 'text', 'byItem')
      }, 10);
    }

    else if (item.Item_Name == txt) {
      setItem((prevSte) => ({
        ...prevSte, Item_Name: fetch_input_val()
      }))
      setTimeout(() => {
        Change_Context('Enter The price', 'text', 'byPrice')
      }, 10);
    }

    else if (item.Spent_Price == txt) {
      setItem((prevSte) => ({
        ...prevSte, Spent_Price: fetch_input_val()
      }))
      setTimeout(() => {
        Change_Context('Enter The Date', 'date', 'byDate')
      }, 10);
    }
  }

  const fetch_input_val = () => {
    return document.getElementById(inputID).value
  }






  const Change_Context = (txtPlaceHolder, txtInput, idInput,) => {
    document.getElementById(inputID).value = '';
    setPlaceHolder(txtPlaceHolder)
    setInputText(txtInput)
    setInputId(idInput)
  }

  const Clear_data = () => {
    setItem({ paymentDate: '', Item_Name: '', Spent_Price: '' })
  }

  const RemoveItemFromFB= async(itemID)=>{
    const db = getDatabase(app)
    const dbRef = ref(db, FB_API.payment_Address + '/' + itemID);
    await remove(dbRef)
  }

  const pushToLocalSql = (itemID) => {
    const payDetails = localDB.filter(itm => itm.PayID == itemID)[0]
    const payData = { Amount: parseInt(payDetails.Amount), Date: new Date(payDetails.paymentDate), Description: payDetails.Description }
    pushSpendMoney(payData).then(async (res) => {
      if (res.data.result === "Saved") {
        RemoveItemFromFB(itemID)

        setTimeout(() => {
          setNotification((prevStatus) => ({
            ...prevStatus,
            activeStatus: true,
            subject: 'Sucessfully...............!!'
          }))
        }, 1200);
        setTimeout(() => {
          setNotification((prevStatus) => ({
            ...prevStatus,
            activeStatus: false,
            subject: ''
          }))
          asyncgetOnlineStoreData()
        }, 2500);
      }
      else {
        setNotification((prevStatus) => ({
          ...prevStatus,
          activeStatus: true,
          subject: 'Error!!!'
        }))
      }
    }).catch((err) => {
      setNotification((prevStatus) => ({
        ...prevStatus,
        activeStatus: true,
        subject: 'service not available'
      }))
    })
  }



  const [inputval, setInputVal] = useState({ year: '', month: '', totalSpend: '' })

  const inputval_flag = () => {
    return inputval.year != '' && inputval.month != ''
  }

  const InputHandler = (name, val) => setInputVal((prevState) => ({ ...prevState, [name]: val }))

  const InputName = () => { return inputval.year == '' ? 'year' : 'month' }


  const InputSelVal = () => { return inputval.year == '' ? inputval.year : inputval.month }

  const InputArry = () => { return profileView.ViewData }

  const search_dailyspend_details = async () => {
    if (inputval_flag()) {
      const getData = await Get_sync(FB_API.daiilyspendInfo_Address)
      if (getData.exists()) {
        const tempDailydata = getData.val()
        const tempDataD = Object.keys(tempDailydata).map((key, i) => {
          return { ...tempDailydata[key] }
        })

        const tempD = Object.keys(tempDataD[0]).map((key, i) => {
          return { ...tempDataD[0][key] }
        })

       
        setProfileView((prevState) => ({
          ...prevState, ViewData: Object.values(tempD).filter((item, i) => {
            setBtnText('Refresh')
            if (
              (new Date(item.dateOfSpend)).toLocaleString('default', { month: 'long' }).toLocaleLowerCase()
              ==
              inputval.month.toLowerCase()) {
              return {
                description: item.description,
                money: item.money,
                dateOfSpend: dateFormat_change(item.dateOfSpend),
                lastupdate: dateFormat_change(item.lastupdate)
              }
            }
          })
        }))
        TotalSpend_Orangement()
      }
    }
  }

  const TotalSpend_Orangement = () => {
    profileData.filter((item, index) => {
      if (item.month == inputval.month) {
        return setInputVal(prevestate => ({
          ...prevestate, totalSpend: item.money
        }))
      }
    })
  }

  const dateFormat_change = (str) => {

    const dt = new Date(str)
    const month = dt.getMonth() + 1; // months from 1-12
    const day = dt.getDate();
    const year = dt.getFullYear();
    return day + "-" + month + "-" + year;

  }

  const paymentmenu_refresh = () => {
    setInputVal({ year: '', month: '' })
  }


  return (

    <div className='dailyspend--main--app'>
      <div className='dailyspend--head'>
        <div>
          <h4>DailySpend Local  APP</h4>
        </div>
        <div>
        </div>
      </div>

      <div className='menu--main--header'>
        <div className='Menu'>
          <ul>
            <li onClick={() => { window.location.replace('https://arjunanr-gf.github.io/DailySpendProject/') }}>HOME</li>
            {localDB.length > 0 && <li onClick={() => changePushMenu('finalpush')}>VIEW</li>}
            <li onClick={() => changePushMenu('profile')}>PROFILE</li>
            <li onClick={() => changePushMenu('payment')}>PAYMENT</li>
          </ul>
          {/* <button className='show--localdb-data' }>VIEW</button>
        <button >PUSH</button> */}
        </div>
      </div>
      <div className='display--item'>
        {pushMenu == 'finalpush' && localDB.length > 0 ?
          <div className='dailyspend--display--item'>
            <h4>View The Data Before Submit</h4>
            <table>
              <thead>

                <th>
                  Payment Desc
                </th>
                <th>
                  Date Of Spend
                </th>
                <th>
                  Money(RS)
                </th>

                <th>
                  Action
                </th>
              </thead>
              <tbody>
                {
                  localDB.map((item, i) => {
                    return <tr>
                      <td key={'desc' + item.PayID}>{paymentMenu.filter(itm => itm.paymentID == item.Description)[0].paymentDesc}</td>
                      <td key={'payment' + item.PayID}>{item.paymentDate}</td>
                      <td key={'amount' + item.PayID}>{item.Amount}</td>
                      <td key={item.PayID + i + 'btn'}><button onClick={() => pushToLocalSql(item.PayID)}>P</button>
                      <button onClick={() => RemoveItemFromFB(item.PayID)}>D</button></td>
                    </tr>
                  })
                }
              </tbody>
            </table>
            <div className='btn--push--local--db'>
              <button onClick={() => { }}>PUSH</button>
            </div>
          </div>
          :
          pushMenu == 'profile' && profileData?.length > 0 ?
           <ProfilePage /> 
            :
            pushMenu == 'payment' ?
              <PayUpdate profileData={profileView.ViewData}  />
              : ''
        }
      </div>
    </div >

  );
}

export default App;
