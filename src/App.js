import './App.css';
import { useEffect, useState } from 'react';
import { getLastUpdateDailySpend, pushSpendMoney } from './ServiceForBackEnd/Api/DailySpendLocalApi';
import { app } from './ServiceForBackEnd/FireBaseConfig/Configuration';
import { getDatabase, push, ref, set, get, remove } from 'firebase/database';
import { FB_API, Get_sync } from './ServiceForBackEnd/FireBaseConfig/FirebaseService';
import Dropdown from './Component/Dropdown/Dropdown'





function App() {

  const [btnText, setBtnText] = useState('SUBMIT')
  const [inputText, setInputText] = useState('date')
  const [inputID, setInputId] = useState('byDate')
  const [inputPlaceHolder, setPlaceHolder] = useState('Enter The' + inputID + '....')
  const [item, setItem] = useState({ paymentDate: '', Item_Name: '', Spent_Price: '' })
  const [db, setDB] = useState([])
  const [notification, setNotification] = useState({ activeStatus: false, subject: '' })


  const [localDB, setLocalDb] = useState([])

  const [pushMenu, setPushMenu] = useState('payment')
  const [paymentMenu, setPaymentMenu] = useState([])

  const [lastupdateInfo, setLastUpdateInfo] = useState('')
  const [profileData, setProfileData] = useState([])

  const [tableView, setTableView] = useState('')

  const [profileView, setProfileView] = useState({ selectedYear: '', selectedMonth: '', ViewData: [] })




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

    else {
      console.log("none there to display!!", profileData.ViewData)
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

    // console.log(profileData[0].money,'ehloloo')
    DailySpendInfo_fun()
  }



  const ProfileViewLoad = () => {
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
      setProfileView({ ViewData:orrangedAry})
    //  console.log(profileData.map((item) => { if (item.year == inputval.year) {return item.month} }),'heloo')
    // monthtest[profileData.map((item) => { if (item.year == inputval.year) { item.month} })] =
    // profileData.map((item) => { if (item.year == inputval.year) { item.month} })
    //   console.log(monthtest,'ghhgg')



  }


  const findMonth = () => {
    console.log('helo find month')
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

  const OnclickSubmit = () => {
    if (item.Item_Name !== '' && item.paymentDate !== '' && item.Spent_Price !== '') {

      let desID = paymentMenu.filter((itm) => itm.paymentDesc === item.Item_Name)[0].paymentID
      const db = getDatabase(app)
      const filepath = push(ref(db, FB_API.payment_Address))
      set(filepath, { Amount: parseInt(item.Spent_Price), paymentDate: item.paymentDate, Description: desID }).then(() => {

        setTimeout(() => {
          setNotification((prevStatus) => ({
            ...prevStatus,
            activeStatus: true,
            subject: 'Added item Sucessfully.................!!!!!!'
          }))
        }, 1200);
        setTimeout(() => {
          setNotification((prevStatus) => ({
            ...prevStatus,
            activeStatus: false,
            subject: ''
          }))
        }, 2500);
      }).catch(() => {
        setNotification((prevStatus) => ({
          ...prevStatus,
          activeStatus: true,
          subject: 'Error!!!'
        }))
      })


      setTimeout(() => {
        Clear_data()
      }, 30);

    }
    else {
      setNotification({ activeStatus: true, subject: 'Please fill all details' })
    }
    // setNotification(true)
  }



  const changePushMenu = (menuName) => {
    setPushMenu(menuName)
    if (menuName == 'profile') {
      firebaseFetchProfile();
    } else {
      asyncgetOnlineStoreData()
    }
  }

  const on_submit_item = (e) => {
    if (fetch_input_val() != '') {
      setBtnText('Processing...')
      swith_input()
      setTimeout(() => {
        setBtnText('submit')
      }, (500))
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


  const push_ready_verification = () => {
    return item.Item_Name != '' && item.paymentDate != '' && item.Spent_Price != '';
  }

  const dropdown_screen_on = () => {
    return item.Item_Name == '' && item.paymentDate != '' && item.Spent_Price == '';
  }


  const push_Db = () => {
    //pushing data to arry to set ready before pushing to local db
    // let guid_ID = uuidv4();
    // db[guid_ID] = []
    // db['spendByDay'] = db['spendByDay'] ?? []
    // db['spendByDay'].push(item)
    OnclickSubmit();
    //clearing the item  and set for next round][]
    setTimeout(() => {
      Clear_data()
    }, 20);
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

  const apply_pay_name = (id) => {
    console.log(id, 'id id did did ')
    document.getElementById('byItem').value =
      paymentMenu.filter((item, index) => { if (item.paymentID == id) { return item } })[0].paymentDesc
  }


  const pushToLocalSql = (itemID) => {
    const payDetails = localDB.filter(itm => itm.PayID == itemID)[0]
    const payData = { Amount: parseInt(payDetails.Amount), Date: new Date(payDetails.paymentDate), Description: payDetails.Description }
    pushSpendMoney(payData).then(async (res) => {
      if (res.data.result === "Saved") {
        const db = getDatabase(app)
        const dbRef = ref(db, FB_API.payment_Address + '/' + itemID);
        await remove(dbRef)

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

        // tempD.map((item, i) => {
        //     console.log(item.year,item.month,inputval.year,inputval.month)
        //   //  return item.Description, (new Date(tempD[i].dateOfSpend)).toLocaleString('default', { month: 'long' })

        // })



        // setProfileView((prevState) => ({
        //   ...prevState, ViewData: []
        //   }))



        // tempD.map((item, i) => {
        //     console.log(item.year,item.month,inputval.year,inputval.month)
        //   //  return item.Description, (new Date(tempD[i].dateOfSpend)).toLocaleString('default', { month: 'long' })

        // })
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
            <h4>Data Ready For Push</h4>
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
                      <td key={item.PayID + i + 'btn'}><button onClick={() => pushToLocalSql(item.PayID)}>P</button></td>
                      {/*<button onClick={() => DeleteFromFrDB(item.PayID)}>D</button></td>*/}
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
            <div className='dailyspend--display--item'>

              <div className='select--menu--main'>
                <div className='select--menu'>
                  {btnText != 'Refresh' && <Dropdown
                    placeholder="select value"
                    size={inputval_flag() == false ? "full" : "small"}
                    name={InputName()}
                    value={InputSelVal()}
                    onClickmeth={InputHandler}
                    dataAry={InputArry()}
                  />
                  }

                  {inputval_flag() == true &&
                    <button onClick={btnText != 'Refresh' ? () => search_dailyspend_details() : () => paymentmenu_refresh()}>
                      {btnText}
                    </button>
                  }
                </div>

                <div className='select--menu--selects'>
                  {inputval.year && <div>Year : {inputval.year}</div>}
                  {inputval.month && <div>Month : {inputval.month}</div>}
                  {inputval.totalSpend && <div>Spend :{inputval.totalSpend}</div>}
                </div>

              </div>





              {/* <div className='spendList_display_screen profiledate'>
                  {
                    profileView.ViewData.map((item, index) => {
                      return <li key={index + 'item'} onClick={() => apply_pay_name(item.paymentID)}>{item}</li>
                    })
                  }

                </div> */}

              {(profileView.ViewData.length > 1 && inputval_flag()) &&
                < div >
                  <table>
                    <thead>
                      <th> Description </th>
                      <th> Money</th>
                      <th> dateOfSpend</th>
                      <th> Last Update</th>
                    </thead>
                    <tbody>
                      {
                        profileView.ViewData.map((item, i) => {
                          if (item.month != 'YEAR')
                            return <tr>
                              <td key={"desc" + i}>{item.description}</td>
                              <td key={"money" + i}>{item.money}</td>
                              <td key={"dateofspend" + i}>{item.dateOfSpend}</td>
                              <td key={"lastupdate" + i}>{item.lastupdate}</td>
                            </tr>
                        })
                      }
                    </tbody>
                  </table>

                </div>
              }
            </div>
            :
            pushMenu == 'payment' ?
              <div className='dailyspend--add--item-block'>
                {notification.activeStatus == true ?
                  <div className='notification'>
                    <p>{notification.subject}</p>
                    <div className='rectangle'></div>
                  </div> : ''
                }

                <div className='display--lastupdate' style={{ fontSize: '10px', padding: '0.3rem', color: 'white', backgroundColor: '#006989', borderRadius: "3px" }}>
                  Last Update was on {lastupdateInfo}
                </div>
                
                <div className='dailyspend--add--item'>
                  <input type={inputText} id={inputID} placeholder={inputPlaceHolder}></input>

                  {dropdown_screen_on() == true ?
                    <div className='spendList_display_screen'>
                      {
                        paymentMenu.map((item, index) => {
                          return <li key={index + 'item'} onClick={() => apply_pay_name(item.paymentID)}>{item.paymentDesc}</li>
                        })
                      }

                    </div>

                    : ''}

                  {push_ready_verification() == true ?
                    <button onClick={() => { push_Db() }}>PUSH</button> :
                    <button onClick={(e) => { on_submit_item(e) }}>{btnText}</button>}
                </div>
                <p>@dailyspend.com</p>
              </div>
              : ''
        }
      </div>
    </div >

  );
}

export default App;
