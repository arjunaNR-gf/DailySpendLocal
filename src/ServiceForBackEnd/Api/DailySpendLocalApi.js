import ClientApi from "./ApiConfig";

const pushSpendMoney = (data) => {
    return ClientApi.post('DailSpend', data)
}

const getLastUpdateDailySpend=()=>{
    return ClientApi.get('DailSpend/getLastUpdate')
}

export { pushSpendMoney,getLastUpdateDailySpend }