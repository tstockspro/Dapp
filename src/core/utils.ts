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
    formatPan
}