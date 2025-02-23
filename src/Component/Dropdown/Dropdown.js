import { useEffect, useRef, useState } from "react";
import './index.css'



export default function Dropdown({ onClickNormal = true, inputID,size, name, value, placeholder, onClickmeth, dataAry }) {

    const [active, setActive] = useState(false)
    const selectionDivRef = useRef(null);




    useEffect(() => {
        // Event handler to capture the click
        const handleClickOutside = (event) => {
            if (selectionDivRef.current && !selectionDivRef.current.contains(event.target)) {
                console.log('Clicked outside the div');
                setActive(false);  // Example action: hide the div when clicked outside
            }
        };

        // Attach the event listener to the document
        document.addEventListener('click', handleClickOutside);

        // Cleanup the event listener when component is unmounted or on re-render
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);  // Empty dependency array to run only once after initial render






    return (
        <>
            <div ref={selectionDivRef} className={`drop--down ${size === 'full' ? 'select_full' : size === 'medium' ? 'select_medium' : 'select_small'}`}>

                <div className="drop--down--input--icon" onClick={() => setActive(true)} >
                    <input  id={inputID} value={value} placeholder={placeholder}
                    />
                </div>
                {
                    active &&
                    <div className="drop--down--list--dispaly">
                        {
                            dataAry.map((item, i) => {
                                return (
                                    <>
                                        {onClickNormal == true ? <span key={i} onClick={() => { onClickmeth(name, item); setActive(false) }}  >{item}</span>
                                            :
                                            <span key={i} onClick={() => { onClickmeth(item.paymentID); setActive(false) }}  >{item.paymentDesc}</span>
                                        }
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
