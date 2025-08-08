import { VersionedTransaction } from "@solana/web3.js";
import { api_spot_buy } from "./api"
import { connection } from "./wallet";

const spotBuy = async(mint:string,address:string,amount:string,sendTx:any,state:any) =>
{
    let tx = false;
    try{
        const txn = await api_spot_buy(mint,address,amount)
        console.log(txn)
        if(txn && txn?.data)
        {
            const txs = VersionedTransaction.deserialize(
                Buffer.from(txn.data,"base64")
            )
            console.log(txs)
            if(state.wallet.sk.length>10)
            {
                tx = await sendTx(state.wallet.sk,txs)
            }else{
                tx = await sendTx(txs,connection)
            }
            
        }
    }catch(e)
    {
        console.error(e);
    }

    return tx;
}
export {
    spotBuy,
}