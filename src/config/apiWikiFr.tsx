import axios from "axios";

const apiWikiFr = axios.create({
    baseURL:"https://fr.wikipedia.org/",
    headers : {
        "Content-Type":"application/json"
    }
})

export default apiWikiFr