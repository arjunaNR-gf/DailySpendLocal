import './App.css';
import { useEffect, useState } from 'react';
import { getLastUpdateDailySpend, pushSpendMoney } from './ServiceForBackEnd/Api/DailySpendLocalApi';




function App() {

  const [lastupdateInfo, setLastUpdateInfo] = useState('')

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

  const [btnText, setBtnText] = useState('SUBMIT')
  const [inputText, setInputText] = useState('date')
  const [inputID, setInputId] = useState('byDate')
  const [inputPlaceHolder, setPlaceHolder] = useState('Enter The' + inputID + '....')
  const [item, setItem] = useState({ Item_Date: '', Item_Name: '', Spent_Price: '' })
  const [db, setDB] = useState([])
  const [SpentOnList] = useState([{ ID: 'AMZ', Name: 'Amazon' },
  { ID: 'EN', Name: 'ENTERTAINMENT' },
  { ID: 'FM', Name: 'FAMILY' },
  { ID: 'HT', Name: 'HOTEL' },
  { ID: 'INSRNS', Name: 'Insurence' },
  { ID: 'LN', Name: 'LOAN' },
  { ID: 'MT', Name: 'MARCHANT' },
  { ID: 'RC', Name: 'REACHARGE' },
  { ID: 'SC', Name: 'SNACKS' },
  { ID: 'SP', Name: 'SHOPPING' },
  { ID: 'TL', Name: 'TRAVEL' },
  { ID: 'WP', Name: 'WEEKEND PARTY' },
  { ID: 'ZT', Name: 'ZOMATO' },
  ])

  const [notification, setNotification] = useState({ activeStatus: false, subject: '' })

  const [localDB, setLocalDb] = useState([])

  const [pushMenu, setPushMenu] = useState('')



  const OnclickSubmit = () => {
    if (item.Item_Name !== '' && item.Item_Date !== '' && item.Spent_Price !== '') {
      let desID = SpentOnList.filter((itm) => itm.Name === item.Item_Name)[0].ID
      const idata = { Amount: parseInt(item.Spent_Price), Date: new Date(item.Item_Date), Description: desID }


      pushSpendMoney(idata).then(res => {
        if (res.data.result === "Saved") {
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
    else {
      setNotification({ activeStatus: true, subject: 'Please fill all details' })
    }
    // setNotification(true)
  }

  const fetch_local_db_data = () => {
    if (JSON.parse(localStorage?.getItem('spenddaily')) != null) {
      setLocalDb(JSON.parse(localStorage?.getItem('spenddaily')))
    }
  }

  const changePushMenu = (menuName) => {
    setPushMenu(menuName)
    fetch_local_db_data();
  }

  const on_submit_item = (e) => {
    if (fetch_input_val() != '') {
      setBtnText('Processing...')
      swith_input()
      setTimeout(() => {
        setBtnText('submit')
      }, (300))
    }

  }

  const swith_input = () => {
    let txt = ''
    if (item.Item_Date == txt) {
      setItem((prevSte) => ({
        ...prevSte, Item_Date: fetch_input_val()
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

  function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxx'
      .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }

  const push_ready_verification = () => {
    return item.Item_Name != '' && item.Item_Date != '' && item.Spent_Price != '';
  }

  const dropdown_screen_on = () => {
    return item.Item_Name == '' && item.Item_Date != '' && item.Spent_Price == '';
  }


  const push_Db = () => {
    //pushing data to arry to set ready before pushing to local db
    // let guid_ID = uuidv4();
    // db[guid_ID] = []
    db['spendByDay'] = db['spendByDay'] ?? []
    db['spendByDay'].push(item)
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
    setItem({ Item_Date: '', Item_Name: '', Spent_Price: '' })
  }

  const apply_pay_name = (id) => {
    document.getElementById('byItem').value =
      SpentOnList.filter((item, index) => { if (item.ID == id) { return item } })[0].Name
  }

  const push_to_local_db = () => {
    for (let i = 0; i < localDB?.length; i++)
      db['spendByDay'].push(localDB[i])
    localStorage.setItem('spenddaily', JSON.stringify(db['spendByDay']))
    setTimeout(() => {
      db['spendByDay'] = []
    }, 30);
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
            <li onClick={() => changePushMenu('finalpush')}>VIEW</li>
            <li onClick={() => changePushMenu('localPush')}>PUSH</li>
          </ul>
          {/* <button className='show--localdb-data' }>VIEW</button>
        <button >PUSH</button> */}
        </div>
      </div>
      <div className='display--item'>
        {pushMenu == 'finalpush' && localDB.length > 0 ? <div className='dailyspend--display--item'>
          <h4>Data Ready For Push</h4>
          <table>
            <tbody>
              {
                localDB.map((item, i) => {
                  return <tr>
                    <td key={'item_local' + i}>{item.Item_Name}</td>
                    <td key={i + 'item_local' + i}>{item.Item_Date}</td>
                    <td key={i + 'item_local' + i}>{item.Spent_Price}</td>
                  </tr>
                })
              }
            </tbody>
          </table>
          <div className='btn--push--local--db'>
            <button onClick={() => { }}>PUSH</button>
          </div>
        </div> : ''}
        {
          pushMenu == 'localPush' && db['spendByDay']?.length > 0 ? <div className='dailyspend--display--item'>
            <h4>Push To Local</h4>
            <table>
              <tbody>
                {
                  db['spendByDay'].map((item, i) => {
                    return <tr>
                      <td>{item.Item_Name}</td>
                      <td>{item.Item_Date}</td>
                      <td>{item.Spent_Price}</td>
                    </tr>
                  })
                }
              </tbody>
            </table>
            <div className='btn--push--local--db'>
              <button onClick={() => { push_to_local_db() }}>PUSH</button>
            </div>
          </div> : ''
        }
      </div>

      <div className='dailyspend--add--item-block'>
        {notification.activeStatus == false ?
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
                SpentOnList.map((item, index) => {
                  return <li key={index + 'item'} onClick={() => apply_pay_name(item.ID)}>{item.Name}</li>
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
    </div>

  );
}

export default App;
