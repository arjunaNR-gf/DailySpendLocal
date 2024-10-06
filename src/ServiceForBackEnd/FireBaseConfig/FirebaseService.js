import { getDatabase, ref, get, set, remove } from "firebase/database"
import { app } from "./Configuration"



const FB_API = {
    profile_Address: 'DailySpend/Profile/OverAllSpendMonth',
    payment_Address: 'DailySpend/Payment/PaymentDetails',
    paymentList_Address: 'DailySpend/Payment/DropDownList'
}

const FirebaseDbConfig = (path) => {
    return ref(getDatabase(app), path)
}

const Get_sync = (path) => {
    return get(FirebaseDbConfig(path))
}


export { Get_sync, FirebaseDbConfig, FB_API }