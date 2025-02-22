
import './../../App.css';
import './../../AppMobile.css'
import { useEffect, useState } from 'react';
import { app } from '../../ServiceForBackEnd/FireBaseConfig/Configuration';
import { getDatabase, push, ref, set, get, remove } from 'firebase/database';
import { FB_API, Get_sync } from '../../ServiceForBackEnd/FireBaseConfig/FirebaseService';
import Dropdown from '../../Component/Dropdown/Dropdown'


const ProfilePage = () => {

    const [btnText, setBtnText] = useState('')

    const [inputval, setInputVal] = useState({ year: '2025', month: 'February', totalSpend: '' })

    const [profileData, setProfileData] = useState([])

    const [profileView, setProfileView] = useState({ selectedYear: '', selectedMonth: '', ViewData: [] })


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
            !inputval_flag() && ProfileViewYearORMonthLoad();

        }
    }


    //fetch data by argument

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
                setBtnText('Refresh')

                setProfileView((prevState) => ({
                    ...prevState, ViewData: Object.values(tempD).filter((item, i) => {

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
        else {
            setBtnText('Search')
            firebaseFetchProfile();
            ProfileViewYearORMonthLoad();
        }

    }


    useEffect(() => {
        search_dailyspend_details();
    }, [search_dailyspend_details])


    const inputval_flag = () => {
        return inputval.year != '' && inputval.month != ''
    }


    const InputHandler = (name, val) => setInputVal((prevState) => ({ ...prevState, [name]: val }))

    const InputName = () => { return inputval.year == '' ? 'year' : 'month' }

    const InputSelVal = () => { return inputval.year == '' ? inputval.year : inputval.month }

    const InputArry = () => { return profileView.ViewData }


    const ProfileViewYearORMonthLoad = () => {
        const monthTest = [
            "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
        ]
        const orrangedAry = [];
        profileData.map((item, i) => {
            if (item.month != 'year' && item.year == inputval.year) {
                orrangedAry[monthTest.indexOf(item.month)] = item.month
            }
        }
        )

        inputval.year == '' ?
            setProfileView({ ViewData: Array.from(new Set(profileData.map((item, i) => { return item.year }))) })
            :
            setProfileView({ ViewData: orrangedAry })


    }

    const dateFormat_change = (str) => {

        const dt = new Date(str)
        const month = dt.getMonth() + 1; // months from 1-12
        const day = dt.getDate();
        const year = dt.getFullYear();
        return day + "-" + month + "-" + year;

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

    const paymentmenu_refresh = () => {
        setInputVal({ year: '', month: '' })
        setTimeout(() => {
            search_dailyspend_details();
        }, 300);

    }

    return (
        <>
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
        </>
    )
}

export default ProfilePage;