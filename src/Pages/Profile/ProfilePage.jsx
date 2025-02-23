
import './../../App.css';
import './../../AppMobile.css'
import { useEffect, useState } from 'react';
import { app } from '../../ServiceForBackEnd/FireBaseConfig/Configuration';
import { getDatabase, push, ref, set, get, remove } from 'firebase/database';
import { FB_API, Get_sync } from '../../ServiceForBackEnd/FireBaseConfig/FirebaseService';
import Dropdown from '../../Component/Dropdown/Dropdown'
import { settings } from 'firebase/analytics';


const ProfilePage = () => {

    const [btnText, setBtnText] = useState('')

    const [inputval, setInputVal] = useState({ year: '2025', month: 'February', totalSpend: '' })

    const [flag, setflag] = useState(0)

    const [profileData, setProfileData] = useState([])

    const [profileView, setProfileView] = useState({
        selectedYear: '', selectedMonth: '',
        ViewYearorMonth: [], ViewData: [{
            description: '',
            money: '',
            dateOfSpend: '',
            lastupdate: ''
        }]
    })


    //this fecth only year/month/money not all 
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
        }
        setTimeout(() => {
            ProfileViewYearORMonthLoad();
        }, 20);
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
            setBtnText('Refresh')

            setProfileView((prevState) => ({
                ...prevState, ViewData: Object.values(tempD).filter((item, i) => {

                    if (
                        (new Date(item.dateOfSpend)).toLocaleString('default', { month: 'long' }).toLocaleLowerCase()
                        ==
                        inputval.month.toLowerCase() && new Date(item.dateOfSpend).getFullYear() == inputval.year) {
                        return {
                            description: item.description,
                            money: item.money,
                            dateOfSpend: dateFormat_change(item.dateOfSpend),
                            lastupdate: dateFormat_change(item.lastupdate)
                        }
                    }
                })
            }))
        }
        TotalSpend_PerMonth();
    }


    //fetch data by argument
    const search_dailyspend_details = async () => {

         firebaseFetchProfile();
        // firebaseFetchProfile();

        // ProfileViewYearORMonthLoad();
        // firebase_Fecth_DailySpend();
        // TotalSpend_PerMonth();
        // !inputval_flag() && setBtnText('Search')
    }

    const inputval_flag = () => {
        return inputval.year != '' && inputval.month != ''
    }

    //set up input handler 
    const InputHandler = (name, val) => {
        setInputVal((prevState) => ({ ...prevState, [name]: val }))
    }

    //it will set the input type mean ID 
    const InputName = () => { return inputval.year == '' ? 'year' : 'month' }

    //it will set the input value based on ID and null value present
    const InputSelVal = () => { return inputval.year == '' ? inputval.year : inputval.month }

    //this will fill the data with values
    const InputArry = () => { return profileView.ViewYearorMonth }


    const ProfileViewYearORMonthLoad = () => {
        const monthTest = [
            "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
        ]
        const orrangedAry = [];

        profileData.map((item, i) => {
            if (item.year == inputval.year) {
                orrangedAry[monthTest.indexOf(item.month)] = item.month
            }
        })

        inputval.year == '' ?
            setProfileView((PrevState) => ({
                ...PrevState,
                ViewYearorMonth: Array.from(new Set(profileData.map((item, i) => { return item.year })))
            }))
            :
            setProfileView((PrevState) => ({ ...PrevState, ViewYearorMonth: orrangedAry }))
            setTimeout(() => {
                firebase_Fecth_DailySpend();
            }, 20);
    }


    const TotalSpend_PerMonth = () => {

        profileData.filter((item, index) => {
            if (item.month.toLocaleLowerCase() === inputval.month.toLocaleLowerCase() && item.year === inputval.year) {
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
        setInputVal({ year: '', month: '', totalSpend: '' })
        setProfileView({ selectedYear: '', selectedMonth: '', ViewYearorMonth: [], ViewData: [] })
    }


    useEffect(() => {
        if (flag == false) {
            search_dailyspend_details();
        }
    }, [search_dailyspend_details])



    return (
        <>
            <div className='dailyspend--display--item'>

                <div className='select--menu--main'>
                    <div className='select--menu'>
                        <Dropdown
                            placeholder="select value"
                            size={inputval_flag() == false ? "full" : "small"}
                            name={InputName()}
                            value={InputSelVal()}
                            onClickmeth={InputHandler}
                            dataAry={InputArry()}
                        />


                        {inputval_flag() == true &&
                            <button onClick={btnText != 'Refresh' ? () => search_dailyspend_details() : () => paymentmenu_refresh()}>
                                {btnText}
                            </button>
                        }
                    </div>

                    {inputval_flag() &&
                        <div className='select--menu--selects'>
                            <div className='display--spend--monthyearspend'>  {inputval.year && <div>Year : {inputval.year}</div>}</div>
                            <div className='display--spend--monthyearspend'>  {inputval.month && <div>Month : {inputval.month.toUpperCase()}</div>}</div>
                            <div className='display--spend--monthyearspend'>  {inputval.totalSpend && <div>Spend :{inputval.totalSpend}</div>}</div>
                        </div>
                    }

                </div>



                <div className='items-scrool'>
                {inputval_flag() &&
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
                                                <td key={"dateofspend" + i}>{new Date(item.dateOfSpend).toLocaleDateString()}</td>
                                                <td key={"lastupdate" + i}>{new Date(item.lastupdate).toLocaleString()}</td>
                                            </tr>
                                    })
                                }
                            </tbody>
                        </table>

                    </div>
                }
                </div>
            </div>
        </>
    )
}

export default ProfilePage;