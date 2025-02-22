import './../../App.css'
import { useEffect, useState } from 'react';
import { app } from '../../ServiceForBackEnd/FireBaseConfig/Configuration';
import { getDatabase, push, ref, set, get, remove } from 'firebase/database';
import { FB_API, Get_sync } from '../../ServiceForBackEnd/FireBaseConfig/FirebaseService';

const PayUpdate = (profileData) => {
    const [btnText, setBtnText] = useState('NEXT..')
    const [inputText, setInputText] = useState('date')
    const [inputID, setInputId] = useState('byDate')
    const [inputPlaceHolder, setPlaceHolder] = useState('Enter The' + inputID + '....')
    const [item, setItem] = useState({ paymentDate: '', Item_Name: '', Spent_Price: '' })
    //const [innerNavigationFlag, setinnerNavigationFlag] = useState("paymentDate")
    const [paymentMenu, setPaymentMenu] = useState([])
    const [lastupdateInfo, setLastUpdateInfo] = useState()
    const [flag,setflag] = useState(0)


    const lastupdateFun = async () => {
        const getDataForLstupt = await Get_sync(FB_API.daiilyspendInfo_Address)
        const tempConvertToVal = getDataForLstupt.val();
        const tempAry = Object.keys(tempConvertToVal).map(key => {
            return { ...tempConvertToVal[key] }
        })
       setLastUpdateInfo( new Date(tempAry.sort()[0][0].lastupdate).toString())

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
    }


    useEffect(() => {
        if(flag ==false)
        {
         
            setflag(1);
            PaymentMenu_Sync();
            lastupdateFun();
        }
         
        
    }, [PaymentMenu_Sync, lastupdateFun])



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


    const Change_Context = (txtPlaceHolder, txtInput, idInput,) => {
        document.getElementById(inputID).value = '';
        setPlaceHolder(txtPlaceHolder)
        setInputText(txtInput)
        setInputId(idInput)
    }


    const fetch_input_val = () => {
        return document.getElementById(inputID).value
    }


    const apply_pay_name = (id) => {
        console.log(id, 'id id did did ')
        document.getElementById('byItem').value =
            paymentMenu.filter((item, index) => { if (item.paymentID == id) { return item } })[0].paymentDesc
    }

    const dropdown_screen_on = () => {
        return item.Item_Name == '' && item.paymentDate != '' && item.Spent_Price == '';
    }

    const push_ready_verification = () => {
        return item.Item_Name != '' && item.paymentDate != '' && item.Spent_Price != '';
    }

    const on_submit_item = (e) => {
        console.log(item, 'items are...')
        if (fetch_input_val() != '') {
            setBtnText('Processing...')
            swith_input()
            setTimeout(() => {
                if (item.paymentDate != '' && item.Item_Name === '') setBtnText('Next..')
                if (item.Item_Name != '') setBtnText('SUBMIT')
            }, (200))
        }
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

    const [notification, setNotification] = useState({ activeStatus: false, subject: 'Payment Info Added Successfully....!' })

    const Clear_data = () => {
        setItem({ paymentDate: '', Item_Name: '', Spent_Price: '' })
    }

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
                }, 1800);
                setTimeout(() => {
                    setNotification((prevStatus) => ({
                        ...prevStatus,
                        activeStatus: false,
                        subject: ''
                    }))
                }, 3900);
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
            setBtnText('Next..')

        }
        else {
            setNotification({ activeStatus: true, subject: 'Please fill all details' })
        }
        // setNotification(true)
    }



    return (
        <>
            <div className='dailyspend--add--item-block'>
                {notification.activeStatus == true ?
                    <div className='notification'>
                  
                        <p>{notification.subject}</p>
                        <div className='notification--icon'></div>
                        <div className='rectangle'></div>
                    </div> : ''
                }

                <div className='display--lastupdate'>
                    Last Update was on {lastupdateInfo}
                </div>

                <div className='dailyspend--add--item payment--input'>
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
        </>
    )
}
export default PayUpdate;