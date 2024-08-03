const fetch = require("node-fetch");

exports.refresh = async (id, type) => {
  // console.log("id", id);
  // console.log("type", type);

  const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/callalone/${id}/${type}`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
    });
    const response = await rawResponse.json();
    // console.log("response refresh accept", response);
  } catch (error) {
    console.log("error", error);
  }
};

// const fetch = require("node-fetch");

exports.refreshGT = async (id) => {
  const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/calltransport`;
  try {
    const rawResponse = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      // body: JSON.stringify({ provider: id }),
    });
    const response = await rawResponse.json();
  } catch (error) {
    console.log("error", error);
  }
};

  exports.refreshGC = async (id) => {
    const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/callcommerce`;
    try {
      const rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ provider: id }),
      });
      const response = await rawResponse.json();
      
    } catch (error) {
      console.log("error", error);
    }
  };


  exports.refreshSingleCommerce = async (id) => {
    const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/singlecommerce/${id}`;
    try {
      const rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      });
      const response = await rawResponse.json();
      // console.log("response refresh accept", response);
    } catch (error) {
      console.log("error", error);
    }
  };
  exports.refreshSingleTransport = async (id) => {
    const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/singletransport/${id}`;
    try {
      const rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      });
      const response = await rawResponse.json();
      // console.log("response refresh accept", response);
    } catch (error) {
      console.log("error", error);
    }
  };
  exports.refreshSingleTruck = async (id) => {
    const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/singletruck/${id}`;
    try {
      const rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      });
      const response = await rawResponse.json();
      // console.log("response refresh accept", response);
    } catch (error) {
      console.log("error", error);
    }
  };
  exports.refreshSingleLineMaker = async (id) => {
    const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/singlelinemaker/${id}`;
    try {
      const rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      });
      const response = await rawResponse.json();
      // console.log("response refresh accept", response);
    } catch (error) {
      console.log("error", error);
    }
  };

  exports.SingleCommerceT = async (id) => {
    const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/single/singlecommercet/${id}`;
    try {
      const rawResponse = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ provider: id }),
      });
      const response = await rawResponse.json();


    } catch (error) {
      console.log("error", error);
    }
  };
  exports.refreshchat = async (requster,transport) => {
    const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/single/chatt`;
    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requster,
          transport
        }),
      });
      const response = await rawResponse.json();
      if (response.success) {
        return response;
      } else {
        return response;
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  exports.refresinq = async (inq) => {
    const url = `${process.env.SERVICE_REFRESH}/api/v1/refresh/single/inq`;
    try {
      const rawResponse = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inq:inq
        }),
      });
      const response = await rawResponse.json();
      if (response.success) {
        return response;
      } else {
        return response;
      }
    } catch (err) {
      console.log("err", err);
    }
  };