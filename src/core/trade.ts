import { VersionedTransaction } from "@solana/web3.js";
import { api_margin_buy, api_spot_buy, api_spot_sell } from "./api"
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

const spotSell = async(mint:string,address:string,amount:string,sendTx:any,state:any) =>
{
    let tx = false;
    try{
        const txn = await api_spot_sell(mint,address,amount)
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


const marginBuy = async(mint:string,address:string,margin:string,amount:string,sendTx:any,state:any) =>
{
    let tx = false;
    try{
        const txn = await api_margin_buy(mint,address,margin,amount)
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
    spotSell,
    marginBuy
}