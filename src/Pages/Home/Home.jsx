import '../../App.css';
import '../../AppMobile.css'
import { useEffect, useState } from 'react';
import { getLastUpdateDailySpend, pushSpendMoney } from '../../ServiceForBackEnd/Api/DailySpendLocalApi';
import { app } from '../../ServiceForBackEnd/FireBaseConfig/Configuration';
import { getDatabase, push, ref, set, get, remove } from 'firebase/database';
import { FB_API, Get_sync } from '../../ServiceForBackEnd/FireBaseConfig/FirebaseService';
import PayUpdate from '../../Pages/Payment/PayUpdate';
import ProfilePage from '../Profile/ProfilePage';
import PayInfoByMenu from '../PayInfoByMenu/PayInfoByMenu';
import { AiOutlineMenu } from "react-icons/ai";
import { BiArrowFromRight } from 'react-icons/bi';
import { BsArrow90DegLeft, BsArrowDownLeft, BsArrowDownRight } from 'react-icons/bs';
import { GrClose } from 'react-icons/gr';



const Home = ({ authenticate }) => {
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const CurrentMonth = month[new Date().getMonth()]
    const [btnText, setBtnText] = useState('NEXT..')
    const [inputText, setInputText] = useState('date')
    const [inputID, setInputId] = useState('byDate')
    const [inputPlaceHolder, setPlaceHolder] = useState('Enter The' + inputID + '....')
    const [item, setItem] = useState({ paymentDate: '', Item_Name: '', Spent_Price: '' })

    const [notification, setNotification] = useState({ activeStatus: false, subject: '' })
    const [innerNavigationFlag, setinnerNavigationFlag] = useState("paymentDate")

    const [isActive,SetIsActive] = useState('inactive')


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
            inputval.year == '' ?
                setProfileView({ ViewData: Array.from(new Set(profileData.map((item, i) => { return item.year }))) })
                :
                setProfileView({ ViewData: orrangedAry })

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
        if (menuName == 'signout') { authenticate('signout', '', '') }
        setPushMenu(menuName)
        if (menuName == 'profile') {
            firebaseFetchProfile();
        } else {
            asyncgetOnlineStoreData()
        }
        SetIsActive('inactive')
    }


    const RemoveItemFromFB = async (itemID) => {
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

    const totalSpendCurrentMonth = () => {
        return localDB.reduce((acc, currentVal) => { return acc += currentVal.Amount }, 0)
    }

   const changeIcondisplay=()=>{
     SetIsActive('active')
    }

    const closeMenu=()=>{
        SetIsActive('inactive');
    }

    return (
        <>
            <div className='dailyspend--head'>
                <div className="home-header"><h1>daily </h1>  <h1>Spend</h1></div>
                <div>
                    <div className='mobilecls header--icon'>
                    <AiOutlineMenu size="30" onClick={changeIcondisplay} />
                    </div>
                </div>
            </div>
            <div className='windowcls'>
                <div className='menu--main--header'>
                    
                    <div className='Menu'>
                        <ul>
                            <li onClick={() => { window.location.replace('https://arjunanr-gf.github.io/DailySpendProject/') }}>Home</li>
                            {localDB.length > 0 && <li onClick={() => changePushMenu('finalpush')}>View</li>}
                            <li onClick={() => changePushMenu('profile')}>Profile</li>
                            <li onClick={() => changePushMenu('profileByMenu')}>ProfileBymenu</li>
                            <li onClick={() => changePushMenu('payment')}>Payment</li>
                            <li onClick={() => changePushMenu('signout')}>SignOut</li>

                        </ul>
                    </div>
                </div>
            </div>

            <div className={`mobilecls ${isActive}`}>
                <div className='menu--main--header'>
                <div className='mobile-menu-header-close'>
                    <GrClose size="20"  onClick={closeMenu} />
                </div>

                        <ul>
                            <li onClick={() => { window.location.replace('https://arjunanr-gf.github.io/DailySpendProject/') }}>Home</li>
                            {localDB.length > 0 && <li onClick={() => changePushMenu('finalpush')}>View</li>}
                            <li onClick={() => changePushMenu('profile')}>Profile</li>
                            <li onClick={() => changePushMenu('profileByMenu')}>ProfileBymenu</li>
                            <li onClick={() => changePushMenu('payment')}>Payment</li>
                            <li onClick={() => changePushMenu('signout')}>SignOut</li>

                        </ul>
                    </div>
            </div>


            <div className='display--item'>
                {pushMenu == 'finalpush' && localDB.length > 0 ?
                    <div className='dailyspend--display--item'>
                        <h4>Spending Details of Month  <p>{CurrentMonth} </p></h4>
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
                                <tr style={{
                                    display: "Flex", alignItems: "center", color: "black", fontSize: "14PX", padding: "10px", backgroundColor: "#8FBC8F"
                                }}> Total :{totalSpendCurrentMonth()} </tr>

                            </tbody>
                        </table>
                        {/* <div className='btn--push--local--db'>
                            <button onClick={() => { }}>PUSH</button>
                        </div> */}
                    </div>
                    :
                    pushMenu == 'profile' && profileData?.length > 0 ?
                        <ProfilePage />
                        :
                        pushMenu == 'profileByMenu' ? <PayInfoByMenu /> :
                            pushMenu == 'payment' ?
                                <PayUpdate profileData={profileView.ViewData} />
                                : ''
                }
            </div>
        </>
    )
}

export default Home;