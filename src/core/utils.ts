import { getAuth, getUserId } from "./storage";

export function formatTime  (totalSeconds: number)  {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

function sleep (ms:number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

function checkAuth() {
  let token = getAuth();
  let uid = getUserId();
  if(token && token.length >5 && uid && uid.length>5)
  {
    return true;
  }

  return false;
}

function formatPan(data:string)
{
  let ret ="";
  for(let i = 0 ; i < data.length ; i++)
  {
    ret+=data[i]
    if((i+1)%4 == 0)
    {
      ret+=" "
    }
  }

  return ret;
}
export {
    sleep,
    checkAuth,
    formatPan
}