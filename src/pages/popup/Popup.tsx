import React, { useState } from 'react';
import Browser from 'webextension-polyfill';

type AuctionInformation = { name?: string, price: number };

const formatPrice = (price: number) => `${price.toFixed(2)} €`;

export default function Popup() {
  const [message, setMessage] = useState<React.ReactNode>()

  async function thang() {
    const auctionTabs = await Browser.tabs.query({
      url: "https://balkanauction.com/*/auction/*" // TODO: extract in a configurable value
    });
    console.log("Discovered the following auction tabs: ", auctionTabs);

    const auctions = [];

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

        const auctionInfomrmation = domAuctionInformation[0].result as AuctionInformation;
        auctions.push({ id: auctionId, ...auctionInfomrmation })
      } catch (error) {
        console.error("Script execution failed:", error);
      }
    }

    auctions.reverse();

    const total = auctions.reduce((sum, auction) => sum + auction.price, 0);

    setMessage(
      <>
        {auctions.map(auction => <p key={auction.id}>- № {auction.id}, {auction.name} - {formatPrice(auction.price)}</p>)}
        <p>Total: {formatPrice(total)}</p>
      </>
    )

    console.log(
      [
        ...auctions.map(auction => `- № ${auction.id}, ${auction.name} - ${formatPrice(auction.price)}`),
        `Total: ${formatPrice(total)}`
      ].join('\n')
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
    // Strip thousands separators (spaces, &nbsp;, commas) so the parts parse as a number
    const intPart = priceContainer?.querySelector('span.int-part')?.textContent?.replace(/\D/g, '');
    const fracPart = priceContainer?.querySelector('span.frac-part')?.textContent?.replace(/\D/g, '');
    const price = Number(`${intPart}.${fracPart}`);

    return { name, price };
  }

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 text-center h-full p-3 bg-gray-800">
      <header className="flex flex-col items-center justify-center text-white">
        <button onClick={() => thang()}>
          do thah thang
        </button>
        {message}
      </header>
    </div>
  );
}