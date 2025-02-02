import axios from "axios";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import QRCode from "react-qr-code";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [url, setUrl] = useState("");
  const [responseData, setResponseData] = useState({});

  const handleSend = async () => {
    if (url.length === 0) {
      toast.error("Enter a URL");
      return;
    }
    if (!isValidURL(url)) {
      toast.warn("Enter a valid URL");
      return;
    }

    try {
      const payload = { originalUrl: url };
      const response = await axios.post("http://localhost:3000/api/short", payload, {
        headers: { "Content-Type": "application/json" },
      });
      
      const data = response.data;
      console.log(data);
      setResponseData(data);
      toast.success(data.message);
    } catch (error) {
      toast.error("Failed to shorten the URL.");
      console.error(error);
    }
  };

  function isValidURL(url) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + 
        "((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|" + 
        "localhost|" + 
        "((\\d{1,3}\\.){3}\\d{1,3}))" + 
        "(\\:\\d+)?" + 
        "(\\/[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?" + 
        "(\\?[;&a-zA-Z0-9%_\\+.~#?&//=]*)?" + 
        "(\\#[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?$", 
      "i"
    );
    return pattern.test(url);
  }

  const handleClickToRedirect = () => {
    if (responseData?.url?.shortUrl) {
      window.location.href = `http://localhost:3000/${responseData.url.shortUrl}`;
    }
  };

  return (
    <div className="w-screen flex justify-center items-center bg-gray-900 min-h-screen">
      <div className="w-96 mt-20 p-4 bg-blue-800 rounded-xl shadow-lg">
        <h1 className="text-center text-slate-200 text-2xl font-bold mb-4">URL SHORTENER</h1>
        
        <textarea
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Your URL"
          className="w-full bg-slate-100 text-slate-600 h-28 placeholder:text-slate-600 placeholder:opacity-50 border border-slate-200 resize-none outline-none rounded-lg p-2 mb-4 focus:border-slate-600"
        />

        <button
          onClick={handleSend}
          className="w-full bg-slate-400 border border-slate-200 rounded-lg p-2 text-white font-bold hover:bg-blue-500 transition duration-300"
        >
          Shorten URL
        </button>

        {responseData?.url?.shortUrl && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <h2 onClick={handleClickToRedirect} className="text-green-300 text-xl font-bold cursor-pointer">
              {responseData.url.shortUrl}
            </h2>

            <QRCode value={`${responseData.url.originalUrl}`} size={128} />

            <p className="text-white text-center">
              ShortURL is a free tool to shorten URLs and generate QR codes.
            </p>
            <p className="text-white text-center">
              Make sharing links easier with our URL shortener.
            </p>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default App;
