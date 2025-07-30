
import config from "./config"

const setKp= (token:string) =>
{
    try{
        localStorage.setItem(config.storage.baseTag+config.storage.router.sec,token)
        return true;
    }catch(e){
        return ""
    }
}

const getKp = () =>
{
    try{
        return localStorage.getItem(config.storage.baseTag+config.storage.router.sec)
    }catch(e){
        console.error(e)
        return ""
    }
}
export{
    setKp,
    getKp
}