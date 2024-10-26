import { useState } from "react";
import './index.css'



export default function Dropdown  ({size,name,value,placeholder,onClickmeth,dataAry}) {

    const [active, setActive] = useState(false)

    return (
        <>
            <div className={`drop--down ${size === 'full' ? 'select_full' : size === 'medium' ? 'select_medium' : 'select_small'}`}>
               
                <div className="drop--down--input--icon" onClick={() => setActive(true)} >
                    <input value={value} placeholder={placeholder}
                        />
                        <span>
                            {/* <DropdownArrowDown /> */}
                        </span>
                </div>
                {
                    active &&
                    <div className="drop--down--list--dispaly">
                        {
                            dataAry.map((item, i) => {
                                return (
                                    <>
                                        <span key={i} onClick={() => { onClickmeth(name, item); setActive(false) }}  >{item}</span>
                                    </>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </>
    )
}
