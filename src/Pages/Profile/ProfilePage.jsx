
import './../../App.css';
import './../../AppMobile.css'
import { useEffect, useState } from 'react';
import { app } from '../../ServiceForBackEnd/FireBaseConfig/Configuration';
import { getDatabase, push, ref, set, get, remove } from 'firebase/database';
import { FB_API, Get_sync } from '../../ServiceForBackEnd/FireBaseConfig/FirebaseService';
import Dropdown from '../../Component/Dropdown/Dropdown'
import DailySpendPieChart from '../../Component/Chart/mySpendChart';
import LoaderNotificaiton from '../../Component/Notification/LoaderNotification';
import { CgProductHunt } from "react-icons/cg";
import { MdDateRange } from "react-icons/md";
import { MdCurrencyRupee } from "react-icons/md";
import { SlRefresh } from "react-icons/sl";

const ProfilePage = () => {
    //it works like dataset
    const [profileView, setProfileView] = useState({
        selectedYear: '', selectedMonth: '',
        selectedContent: '',
        ViewYearorMonth: [],
        SpendDB: [],
        ViewData:
            [{
                description: '',
                money: '',
                dateOfSpend: '',
                lastupdate: ''
            }]
    })

    //this will  controll intial value of dispaly at profile page
    const monthDetails = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ]

    const [inputval, setInputVal] =
        useState({ year: new Date().getFullYear(), month: monthDetails[new Date().getMonth()], Total: 0, totalSpend: 0 })


    const [notificationActive, setNotificationActive] = useState(false)

    //this is just to set width of DROP DOWN Box
    const inputval_flag = () => {
        return inputval.year != '' && inputval.month != ''
    }

    //Regresh button
    const [btnText, setBtnText] = useState('REFRESH')

    useEffect(() => {
        firebase_Fecth_DailySpend()
    }, [inputval.month, inputval.year])
    //set up input box value at end according to requirement
    const InputHandler = (name, val) => {
        setInputVal((prevState) => ({ ...prevState, [name]: val }))
    }

    //it will set the input type mean name 
    const InputName = () => { return inputval.year === '' ? 'year' : 'month' }

    //it will set the input value based on ID and null value present
    const InputSelVal = () => { return inputval.year === '' ? inputval.year : inputval.month }

    //this will fill the data with values
    const InputArry = () => { return profileView.ViewYearorMonth }



    //step 1 : once Profile Option Load , helps to load currect year, month data
    //this fecth only on that month under specified year how much spent
    //pull all daily spend details irrespective of month day year
    const firebase_Fecth_DailySpend = async () => {
        setNotificationActive(true); // Show loader

        const getData = await Get_sync(FB_API.daiilyspendInfo_Address);

        if (getData.exists()) {
            const tempDataD = Object.keys(getData.val()).map(key => ({
                ...getData.val()[key],
            }));

            const temp = Object.keys(tempDataD[0]).map(key => ({
                ...tempDataD[0][key],
            }));

            console.log(temp,'testdata')
            //to display over all spend on year /Month
            setInputVal((prevState) => ({
                ...prevState,
                Total: temp.filter(yearspend => new Date(yearspend.dateOfSpend).getFullYear() === inputval.year).reduce((sum, resultArrya) => sum + Number(resultArrya.money), 0),
                totalSpend: temp.filter(monthandyear => new Date(monthandyear.dateOfSpend).getFullYear() === inputval.year && monthDetails[new Date(monthandyear.dateOfSpend).getMonth()] === inputval.month).
                    reduce((sum, resultAry) => sum + Number(resultAry.money), 0)
            }))



            //fetch data by year & month
            const ftemp = temp.filter(item =>
                new Date(item.dateOfSpend).getMonth() === monthDetails.indexOf(inputval.month) &&
                new Date(item.dateOfSpend).getFullYear() === inputval.year
            );

            setProfileView(prevState => ({
                ...prevState,
                ViewData: ftemp,
            }));
            getMonthName(temp);
        }
        setTimeout(() => {
            setNotificationActive(false); // Hide loader
        }, 300);
    };

    //this assign all year available
    const getYearNumber = (tempDate) => {
        setProfileView((prevState) => ({
            ...prevState,
            ViewYearorMonth: Array.from(new Set(
                tempDate.map((item, i) => {
                    return new Date(item.dateOfSpend).getFullYear()
                })))
        }))
    }

    //this pull all month available
    const getMonthName = (tempdate) => {
        setProfileView((prevState) => ({
            ...prevState,
            ViewYearorMonth: Array.from(new Set(
                tempdate.filter(item => new Date(item.dateOfSpend).getFullYear() === inputval.year).map((item, i) => {
                    return monthDetails[new Date(item.dateOfSpend).getMonth()]
                })))
        }))
    }

    const dailyspend_pull = async () => {
        const getData = await Get_sync(FB_API.daiilyspendInfo_Address);

        if (getData.exists()) {
            const tempDataD = Object.keys(getData.val()).map(key => ({
                ...getData.val()[key],
            }));

            const temp = Object.keys(tempDataD[0]).map(key => ({
                ...tempDataD[0][key],
            }));
            getYearNumber(temp)
        }
    }


    const dateFormat_change = (str) => {
        const dt = new Date(str)
        const month = dt.getMonth() + 1; // months from 1-12
        const day = dt.getDate();
        const year = dt.getFullYear();
        return day + "-" + month + "-" + year;
    }


    //refresh
    const paymentmenu_refresh = () => {
        setTimeout(() => {
            setInputVal({ year: '', month: '', Total: 0, totalSpend: 0 })
        }, 10);


        setProfileView({
            selectedYear: '', selectedMonth: '',
            ViewYearorMonth: [],
            selectedContent: '',
            ViewData:
                [{
                    description: '',
                    money: '',
                    dateOfSpend: '',
                    lastupdate: ''
                }]
        })
        setTimeout(() => {
            dailyspend_pull();
        }, 40)
    }

    return (
        <>
            <div className='dailyspend--display--item'>
                <div className='select--menu--main'>
                    <div className='select--menu'>
                        {<Dropdown
                            placeholder="select value"
                            placement="bottom"
                            size={inputval_flag() == false ? "full" : "medium"}
                            name={InputName()}
                            value={InputSelVal()}
                            onClickmeth={InputHandler}
                            dataAry={InputArry()}
                        />}
                        {inputval_flag() == true &&
                            <button onClick={() => paymentmenu_refresh()}>
                                <SlRefresh color='black' size="40" />
                            </button>
                        }
                    </div>

                    {inputval_flag() &&
                        <div className='select--menu--selects'>

                            <div className='display--spend--monthyearspend'>  {inputval.year && <div>Year : {inputval.year}</div>}</div>
                            <div className='display--spend--monthyearspend'>  {inputval.Total !== 0 ? <div>Total/Y : {inputval.Total}</div> : <LoaderNotificaiton type={'DD'} />}</div>
                            <div className='display--spend--monthyearspend'>  {inputval.month && <div>Month : {inputval.month.toUpperCase()}</div>}</div>
                            <div className='display--spend--monthyearspend'>  {inputval.totalSpend !== 0 ? <div>Spend/M :{inputval.totalSpend}</div> : <LoaderNotificaiton type={'DD'} />}</div>
                        </div>
                    }
                </div>

                <table>
                    <thead>
                        <th> <CgProductHunt size="35" />  Description </th>
                        <th> <MdCurrencyRupee size="35" /> Money</th>
                        <th> <MdDateRange size="35" />  dateOfSpend</th>
                    </thead>
                </table>
                <div className='items-scrool'>
                    {notificationActive && <LoaderNotificaiton type={'CS'} text={"Please wait for a second..."} />}
                    {(inputval_flag() && profileView.ViewData.length > 1) ? (
                        < div >
                            <table>
                                <tbody>
                                    {
                                        profileView.ViewData.map((item, i) => {
                                            if (item.month !== 'YEAR') {
                                                return (
                                                    <tr key={i}>
                                                        <td><CgProductHunt size="25" /> {item.description}</td>
                                                        <td><MdCurrencyRupee size="25" />{item.money}</td>
                                                        <td><MdDateRange size="25" /> {new Date(item.dateOfSpend).toLocaleDateString()}</td>
                                                        {/* <td>{new Date(item.lastupdate).toLocaleString()}</td> */}
                                                    </tr>
                                                );
                                            }
                                        })

                                    }
                                </tbody>

                            </table>
                        </div>
                    ) : 'No Data'
                    }
                </div>
            </div>
        </>
    )
}

export default ProfilePage;