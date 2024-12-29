import axios from "axios";
const ClientApi = axios.create({
    baseURL: 'http://localhost:7062/',
    headers: {
        'Accept': 'application/json',
        //'Authorization': 'token <your-token-here>
    }
});
export default ClientApi;