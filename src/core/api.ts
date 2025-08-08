import config from "./config";

async function requester(url: string, requestOptions: any) {
    try {
      return (await fetch(url, requestOptions)).json();
    } catch (e) {
      console.log("🐞 req error", e);
    }
  
    return false;
  }
  
  function request_method_get(headers: any) {
    var requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };
    return requestOptions;
  }
  
  function request_method_post(bodys: any, headers: any) {
    var requestOptions = {
      method: "POST",
      headers: headers,
      body: bodys,
      redirect: "follow",
    };
  
    return requestOptions;
  }
  
  function request_get_unauth() {
    return request_method_get({});
  }

  function request_get_auth() {
    return request_method_get(
      {
        token:0//getAuth()
      }
    );
  }
  
  function request_post_unauth(data: any) {
    var h = new Headers();
  
    h.append("Content-Type", "application/json");
  
    return request_method_post(JSON.stringify(data), h);
  }

  function request_post_auth(data: any) {
    var h = new Headers();
  
    h.append("Content-Type", "application/json");
  
    // h.append("token", getAuth());

    return request_method_post(JSON.stringify(data), h);
  }
  
  
  async function api_token_price(token:string) {
    try {
      return await requester(
        `${config.api.jup.liteUrl}${config.api.jup.price}?ids=${token}`,
        request_get_unauth(),
      );
    } catch (e) {
      console.error(e);
  
      return 0;
    }
  }

  async function api_spot_buy(mint:string,address:string,amount:string) {
    try {
      return await requester(
        `${config.api.tstocks.baseUrl}${config.api.tstocks.router.spot.buy}`,
        request_post_unauth({mint,address,amount}),
      );
    } catch (e) {
      console.error(e);
  
      return 0;
    }
  }

  export {
    api_token_price,
    api_spot_buy
  }