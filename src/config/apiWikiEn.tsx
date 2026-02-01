import axios from "axios";

const apiWikiEn = axios.create({
    baseURL:"https://en.wikipedia.org/api/rest_v1/page/summary/",
    headers : {
        "Content-Type":"application/json"
    }
})

export default apiWikiEn