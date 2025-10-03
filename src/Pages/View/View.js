import { FB_API, Get_sync } from "../../ServiceForBackEnd/FireBaseConfig/FirebaseService";

const View =()=>{
 
            const tempDB =  Get_sync(FB_API.payment_Address).val()
            const tempData = Object.keys(tempDB).map((key, i) => {
                return { ...tempDB[key] }
                
            })

  console.log(tempData,'this is for testing');
    
    return(
        <>
            <h1>hello view</h1>
        </>
    )
}

export default View;