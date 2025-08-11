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


            //     let ary =[];
            //   Object.keys(tempD).forEach(element => {
            //    if(ary[tempD[element].description])
            //    {
            //     ary[tempD[element].description].push(tempD[element])
            //    }
            //    else{
            //     ary[tempD[element].description]=[]
            //    }

            //   })
            setDataStoreDb(tempD)






            // tempD.reduce((dataary,newaryval)=>,[])
        }
        //     setBtnText('Refresh')

        //     setProfileView((prevState) => ({
        //         ...prevState, ViewData: Object.values(tempD).filter((item, i) => {

        //             if (
        //                 (new Date(item.dateOfSpend)).toLocaleString('default', { month: 'long' }).toLocaleLowerCase()
        //                 ==
        //                 inputval.month.toLowerCase() && new Date(item.dateOfSpend).getFullYear() == inputval.year) {
        //                 return {
        //                     description: item.description,
        //                     money: item.money,
        //                     dateOfSpend: dateFormat_change(item.dateOfSpend),
        //                     lastupdate: dateFormat_change(item.lastupdate)
        //                 }
        //             }
        //         })
        //     }))
        // }

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
            //ary.reduce((agg, currentVal, indexVal) => console.log(agg[indexVal]))
            // ary.reduce((arg,currentVal)=>{console.log(arg)})


        }
        else {
          ''
        }
    }

    useEffect(() => {
        firebase_Fecth_DailySpend();
        PaymentMenu_Sync();
    })

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
                <Dropdown placeholder="Select your option" name="menuopt" value={menuopt} dataAry={menu} size="medium" onClickmeth={display_DropDown_Option} />
            {active &&   <div className='payinfobymenu-item-total-display'>         <h3>Total : {SpendAmount}</h3></div>}
            </div>
            {active && 
            <>
          
              <div className='payinfobymenu-item--display'>
       
                <table>
                    <thead>
                        <th>
                           < CgProductHunt size="35"/> Description
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
                                if(i%2==0)
                                {
                                    return <tr  className='evenRow'>
                                    <td key={'amount' + i}>< CgProductHunt size="25"/>{item.description}</td>
                                    <td  key={'payment' + i}> <MdDateRange size="25" />{new Date(item.dateOfSpend).toLocaleDateString()}</td>
                                    <td key={'amount' + i + 1}><MdCurrencyRupee size="25" /> {item.money}</td>

                                </tr>
                                }
                                else
                                {
                                    return <tr  className='oddRow'>
                                    <td key={'amount' + i}> < CgProductHunt size="25"/>{item.description}</td>
                                    <td key={'payment' + i}> <MdDateRange size="25"  />{new Date(item.dateOfSpend).toLocaleDateString()}</td>
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