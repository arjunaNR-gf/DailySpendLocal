import './index.css'
const InputPad=({inputName,type,inputValue,lable,placeholder,inputhandler})=>{
    return(
        <>
        <label>{lable}</label>
        <input id='inpt' type={type} placeholder={placeholder} onChange={(e)=>inputhandler(e)}  name={inputName} value={inputValue}  />
        </>
    )
}

export default InputPad;

