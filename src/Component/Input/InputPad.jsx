import { useEffect } from 'react';
import './index.css'
const InputPad = ({ inputName, type, inputValue, lable, placeholder, inputhandler, onKeyDwn }) => {

    return (
        <>
            <label>{lable}</label>
            <input id='inpt'
                type={type}
                autocomplete="off"
                placeholder={placeholder}
                onChange={(e) => inputhandler(e)}
                name={inputName} value={inputValue}
                onKeyDown={(e) => onKeyDwn(e)}
            />
        </>
    )
}

export default InputPad;

