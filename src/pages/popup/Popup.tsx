import React, { useState } from 'react';
import Browser from 'webextension-polyfill';
import type { Tabs } from 'webextension-polyfill';

export default function Popup() {
  const [message, setMessage] = useState("")

  async function thang() {
    let auctionTabs = await Browser.tabs.query({
      url: "https://balkanauction.com/*/auction/*" // TODO: extract in a configurable value
    });
    console.log(auctionTabs);
    const tabUrls = auctionTabs.map(tab => tab.url).join("\n");
    setMessage(tabUrls)
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
      <header className="flex flex-col items-center justify-center text-white">
        <button onClick={_ => thang()}>
          do thah thang1
        </button>
        {message}
      </header>
    </div>
  );
}