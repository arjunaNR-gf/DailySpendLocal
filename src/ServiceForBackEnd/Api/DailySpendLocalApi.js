import ClientApi from "./ApiConfig";

const pushSpendMoney = (data) => {
    return ClientApi.post('DailSpend', data)
}

const getLastUpdateDailySpend=()=>{
    return ClientApi.get('DailSpend/getLastUpdate')
}

const getServerstatus=()=>{
 return ClientApi.get('ServerAvailability/ServerStatus')
}

export { pushSpendMoney,getLastUpdateDailySpend,getServerstatus }