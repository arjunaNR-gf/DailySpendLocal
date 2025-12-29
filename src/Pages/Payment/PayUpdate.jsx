import './../../App.css'
import { useEffect, useRef, useState } from 'react';
import { app } from '../../ServiceForBackEnd/FireBaseConfig/Configuration';
import { getDatabase, push, ref, set, get, remove } from 'firebase/database';
import { FB_API, Get_sync } from '../../ServiceForBackEnd/FireBaseConfig/FirebaseService';
import Dropdown from '../../Component/Dropdown/Dropdown';
import DailySpendPieChart from '../../Component/Chart/mySpendChart';
import './index.css'


const PayUpdate = (profileData) => {
    const [btnText, setBtnText] = useState('NEXT >')
    const [inputText, setInputText] = useState('date')
    const [inputID, setInputId] = useState('byDate')
    const [inputPlaceHolder, setPlaceHolder] = useState('Enter The' + inputID + '....')
    const [item, setItem] = useState({ paymentDate: '', Item_Name: '', Spent_Price: '' })
    const [paymentMenu, setPaymentMenu] = useState([])
    const [lastupdateInfo, setLastUpdateInfo] = useState()
    const [listActive, setListActive] = useState(false);
    const [flag, setflag] = useState(0)
    const [dataStoreDb, setDataStoreDb] = useState([])


    const lastupdateFun = async () => {
        const getDataForLstupt = await Get_sync(FB_API.daiilyspendInfo_Address)
        const tempConvertToVal = getDataForLstupt.val();
        const tempAry = Object.keys(tempConvertToVal).map(key => {
            return { ...tempConvertToVal[key] }
        })
        setLastUpdateInfo(new Date(tempAry.sort()[0][0].lastupdate).toLocaleString())

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
            ''
        }
    }

    const firebase_Fecth_DailySpend = async () => {
        const getData = await Get_sync(FB_API.daiilyspendInfo_Address)
        if (getData.exists()) {
            const tempDailydata = getData.val()
            const tempDataD = Object.keys(tempDailydata).map((key, i) => {
                return { ...tempDailydata[key] }
            })

            const tempD = Object.keys(tempDataD[0]).map((key, i) => {
                return { ...tempDataD[0][key] }
            })
            setTimeout(() => {
                var tempSeparator = {};
                tempD.forEach(item => {
                    if (tempSeparator[item.description]) {
                        tempSeparator[item.description] = tempSeparator[item.description] + Number(item.money)
                    }
                    else {
                        tempSeparator[item.description] = Number(item.money);
                    }
                })
                setDataStoreDb(Object.keys(tempSeparator).map(item => {
                    return { name: item, value: tempSeparator[item] }
                }))
            }, 40);
        }

    }


    useEffect(() => {

        if (flag == false) {

            setflag(1);
            PaymentMenu_Sync();
            lastupdateFun();
            firebase_Fecth_DailySpend();
        }
        dropdown_screen_on();

    }, [PaymentMenu_Sync, lastupdateFun, firebase_Fecth_DailySpend])



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
        document.getElementById('byItem').value =
            paymentMenu.filter((item, index) => { if (item.paymentID == id) { return item } })[0].paymentDesc
    }

    const dropdown_screen_on = () => {

        if (item.Item_Name == '' && item.paymentDate != '' && item.Spent_Price == '') {
            return setListActive(true)
        }

        setListActive(false)
    }

    const push_ready_verification = () => {
        return item.Item_Name != '' && item.paymentDate != '' && item.Spent_Price != '';
    }

    const on_submit_item = (e) => {
        if (fetch_input_val() != '') {
            setBtnText('Next...')
            swith_input()
            setTimeout(() => {
                if (item.paymentDate != '' && item.Item_Name === '') setBtnText('Next..')
                if (item.Item_Name != '') setBtnText('SUBMIT')
            }, (200))
        }

    }


    const push_Db = () => {
        OnclickSubmit();
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
                        subject: 'Item Added Sucessfully!'
                    }))
                }, 100);
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
            <div className='payment-menu-divider'>

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
                        {listActive == true ? <Dropdown size="full" placement="top" dataAry={paymentMenu} inputID={inputID} placeholder={inputPlaceHolder} onClickmeth={apply_pay_name} onClickNormal={false} />
                            :
                            <input type={inputText} id={inputID} placeholder={inputPlaceHolder}></input>
                        }
                        {/* 
                        // <div ref={selectDrpDownDivref} className='spendList_display_screen'>
                        //     {
                        //         paymentMenu.map((item, index) => {
                        //             return <li key={index + 'item'} onClick={() => apply_pay_name(item.paymentID)}>{item.paymentDesc}</li>
                        //         })
                        //     }

                        // </div>} */}



                        {push_ready_verification() == true ?
                            <button onClick={() => { push_Db() }}>PUSH</button> :
                            <button onClick={(e) => { on_submit_item(e) }}>{btnText}</button>}
                    </div>
                    <p>@dailyspend.com</p>
                </div>

                <DailySpendPieChart dataval={dataStoreDb} />

            </div>

        </>
    )
}
export default PayUpdate;