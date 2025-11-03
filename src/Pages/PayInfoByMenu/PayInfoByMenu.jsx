import { useEffect, useState } from 'react';
import { FB_API, Get_sync } from '../../ServiceForBackEnd/FireBaseConfig/FirebaseService';
import Dropdown from '../../Component/Dropdown/Dropdown';
import './index.css'
import { CgProductHunt } from "react-icons/cg";
import { MdDateRange } from "react-icons/md";
import { MdCurrencyRupee } from "react-icons/md";




const PayInfoByMenu = () => {

    const [dataStoreDb, setDataStoreDb] = useState([])
    const [menu, setMenu] = useState([])
    const [menuData, setMenuData] = useState([])
    const [SpendAmount, setSpendAmount] = useState(0)

    const [menuopt, setMenuOpt] = useState('')
    const [active, setActive] = useState('')
    const [yearOpt, setYearOpt] = useState('')

    const [yearList, setyearList] = useState([])
    const [amountOpt,SetAmountOpt] = useState('')
    const [amountList,setAmountList] = useState([])
    const [DropdownDisable, setDropdownDisabled] = useState(true)

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
            setDataStoreDb(tempD);
            getYearNumber(tempD);
            getAmount(tempD)
            setDropdownDisabled(false)
        }
    }
   

    const display_DropDown_year = (name, item) => {
        setYearOpt(item)
        setMenuData(dataStoreDb.filter((val, index) => { if (val.description === menuopt && new Date(val.dateOfSpend).getFullYear() === item) { return val } }))
        setSpendAmount(
            dataStoreDb.reduce((acc, curent) => {
                if (curent.description === menuopt && new Date(curent.dateOfSpend).getFullYear() === item) {
                    acc += parseInt(curent.money)
                }
                return acc;
            }, 0))
    }

    const display_DropDown_ByAmount = (name,amount) => {

        SetAmountOpt(amount)
        setAmountList(dataStoreDb.filter((val, index) => { if ( val.money=== amount) { return val } }))
        setSpendAmount(
            dataStoreDb.reduce((acc, curent) => {
                if (curent.money === amount) {
                    acc += parseInt(curent.money)
                }
                return acc;
            }, 0))
    }

     //this assign all year available
    const getYearNumber = (tempDate) => {
        setyearList((prevState) =>
            [... new Set(
                tempDate.map((item, i) => {
                    return new Date(item.dateOfSpend).getFullYear()
                })), 'All'])

    }
     //this assign all year available
    const getAmount = (tempDate) => {
        setAmountList((prevState) =>
            [... new Set(
                tempDate.map((item, i) => {
                    return item.money
                }))])

    }

    const PaymentMenu_Sync = async () => {
        const dbData = await Get_sync(FB_API.paymentList_Address)
        if (dbData.exists()) {
            const tempData = dbData.val()
            const tempAry = Object.keys(tempData).map(key => {
                return { ...tempData[key] }
            })

            const ary = Object.keys(tempAry[0]).map(key => {
                return { ...tempAry[0][key] }
            })
            setMenu(ary.map((item) => {
                return item.paymentDesc
            }))
        }
        else {
            ''
        }
    }

    useEffect(() => {
        firebase_Fecth_DailySpend();
        PaymentMenu_Sync();
    }, [])

    const display_DropDown_Option = (name, item) => {
        setMenuOpt(item)
        setActive(true)
        setMenuData(dataStoreDb.filter((val, index) => { if (val.description === item) { return val } }))

        setSpendAmount(
            dataStoreDb.reduce((acc, curent) => {
                if (curent.description == item) {
                    acc += parseInt(curent.money)
                }
                return acc;
            }, 0))
    }


    return (
        <>
            <div className='payinfobymenu'>
                <Dropdown placeholder="Select your option" name="menuopt" value={menuopt} dataAry={menu} size="medium" placement="bottom" onClickmeth={display_DropDown_Option} />
                <Dropdown placeholder="Select year" name="yearOpt" value={yearOpt} dataAry={yearList} size="small" placement="bottom" onClickmeth={display_DropDown_year} />
              {/* <Dropdown placeholder="Select Amount" name="amountOpt" value={amountOpt} dataAry={amountList} size="small" placement="bottom" onClickmeth={display_DropDown_ByAmount} /> */}

                {active && <div className='payinfobymenu-item-total-display'>         <h3>Total : {SpendAmount}</h3></div>}
            </div>
            {active &&
                <>

                    <div className='payinfobymenu-item--display'>

                        <table>
                            <thead>
                                <th>
                                    < CgProductHunt size="35" /> Description
                                </th>

                                <th>
                                    <MdDateRange size="35" /> Date Of Spend
                                </th>
                                <th>
                                    <MdCurrencyRupee size="35" />  Money(RS)
                                </th>
                            </thead>
                            <tbody>
                                {
                                    menuData.map((item, i) => {
                                        if (i % 2 == 0) {
                                            return <tr className='evenRow'>
                                                <td key={'amount' + i}>< CgProductHunt size="25" />{item.description}</td>
                                                <td key={'payment' + i}> <MdDateRange size="25" />{new Date(item.dateOfSpend).toLocaleDateString()}</td>
                                                <td key={'amount' + i + 1}><MdCurrencyRupee size="25" /> {item.money}</td>

                                            </tr>
                                        }
                                        else {
                                            return <tr className='oddRow'>
                                                <td key={'amount' + i}> < CgProductHunt size="25" />{item.description}</td>
                                                <td key={'payment' + i}> <MdDateRange size="25" />{new Date(item.dateOfSpend).toLocaleDateString()}</td>
                                                <td key={'amount' + i + 1}><MdCurrencyRupee size="25" />  {item.money}</td>

                                            </tr>
                                        }
                                    })
                                }
                            </tbody>
                        </table>

                    </div>
                </>
            }
        </>
    )
}

export default PayInfoByMenu;