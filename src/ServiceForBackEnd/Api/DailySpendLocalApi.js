import ClientApi from "./ApiConfig";

const pushSpendMoney = (data) => {
    return ClientApi.post('DailSpend', data)
}

export { pushSpendMoney }