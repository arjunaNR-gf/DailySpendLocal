import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { toBeEmpty } from '@testing-library/jest-dom/dist/matchers';

function App() {

  const [btnText, setBtnText] = useState('submit')
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

  const[localDB,setLocalDb] = useState([])

  const[pushMenu,setPushMenu] = useState('')

  useEffect(() => {
  })

  const fetch_local_db_data=()=>{
    if(JSON.parse(localStorage?.getItem('spenddaily')) !=null ){
      setLocalDb( JSON.parse(localStorage?.getItem('spenddaily')))
    }
  }

  const changePushMenu =(menuName)=>{
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
    //clearing the item  and set for next round][]
    setTimeout(() => {
      Clear_data()
    }, 10);
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
    for(let i= 0 ; i<localDB?.length;i++)
    db['spendByDay'].push(localDB[i])
    localStorage.setItem('spenddaily', JSON.stringify(db['spendByDay']))
    setTimeout(() => {
      db['spendByDay']=[]
      }, 30);
  }

  return (

    <div className='dailyspend--main--app'>
      <div className='dailyspend--head'>
        <span className='title'>
          <h4>Dailyspend Local  APP</h4>
        </span>
      </div>

      <div className='pushMenu'>
            <button className='show--localdb-data' onClick={()=>changePushMenu('finalpush')}>VIEW</button>
            <button onClick={()=>changePushMenu('localPush')}>PUSH</button>
          </div>

          <div className='display--item'>
          { pushMenu=='finalpush' && localDB.length > 0 ? <div className='dailyspend--display--item'>
          <h4>Data Ready For Push</h4>
          <table>
          <tbody>
            {
             localDB.map((item, i) => {
                return <tr>
                  <td key={'item_local'+i}>{item.Item_Name}</td>
                  <td  key={i+'item_local'+i}>{item.Item_Date}</td>
                  <td  key={i+'item_local'+i}>{item.Spent_Price}</td>
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
        pushMenu=='localPush' && db['spendByDay']?.length > 0 ? <div className='dailyspend--display--item'>
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
        <input type={inputText} id={inputID} placeholder={inputPlaceHolder}></input>
        {dropdown_screen_on() == true ?
          <div className='spendList_display_screen'>
            {
              SpentOnList.map((item, index) => {
                return <tr key={index + 'item'} onClick={() => apply_pay_name(item.ID)}>{item.Name}</tr>
              })
            }
          </div> : ''}

        {push_ready_verification() == true ?
          <button onClick={() => { push_Db() }}>PUSH</button> :
          <button onClick={(e) => { on_submit_item(e) }}>{btnText}</button>}
      </div>
     

      
         

       
          <p>@dailyspend.com</p>

    </div>

  );
}

export default App;
