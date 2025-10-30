import React, { useState } from 'react';
import Browser from 'webextension-polyfill';

export default function Popup() {
  const [message, setMessage] = useState<Element[]>()

  async function thang() {
    let auctionTabs = await Browser.tabs.query({
      url: "https://balkanauction.com/*/auction/*" // TODO: extract in a configurable value
    });
    console.log("Discovered the following auction tabs: ", auctionTabs);

    let auctions = [];

    for (const tab of auctionTabs) {
      if (!tab.id || !tab.url) continue;

      // Getting the last path segment, which contains the auction id
      const auctionId = tab.url.substring(tab.url.lastIndexOf('/') + 1)
      console.log(auctionId)

      try {
        const domAuctionInformation = await Browser.scripting.executeScript({
          target: { tabId: tab.id },
          args: ['body'],
          func: DOMtoString
        });
        console.log("Script result:", domAuctionInformation);

        const auctionInfomrmation: any = domAuctionInformation[0].result; // TODO: types
        auctions.push({ id: auctionId, ...auctionInfomrmation })
      } catch (error) {
        console.error("Script execution failed:", error);
      }
    }

    setMessage(
      auctions.map(auction => <p>- № {auction.id}, {auction.name} - {auction.price}</p>)
    )

    console.log(

      auctions.map(auction => `- № ${auction.id}, ${auction.name} - ${auction.price}`).join('\n')
    )
  };

  function DOMtoString(selector: string) { //TODO: return type
    let dom;

    if (selector) {
      dom = document.querySelector(selector);
      if (!selector) return "ERROR: querySelector failed to find node"
    } else {
      dom = document.documentElement;
    }

    if (!dom) return null;

    const name = dom.querySelector('h1')?.innerText;
    const priceContainer = dom.querySelector('.price-container');
    const price = `${priceContainer?.querySelector('span.int-part')?.innerHTML}.${priceContainer?.querySelector('span.frac-part')?.innerHTML} лв.`;

    return { name, price };
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
      <header className="flex flex-col items-center justify-center text-white">
        <button onClick={_ => thang()}>
          do thah thang
        </button>
        {message}
      </header>
    </div>
  );
}