'use client'
import { useState, useEffect } from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import { BiUpvote } from 'react-icons/bi';
import Image from 'next/image';
import img from '../../../public/event1.jpg';
import { useStateContext } from '@/context/eventContext';
import QRCode from 'react-qr-code';
import WalletConnect  from '@/components/WalletConnect';
import { Contract, BrowserProvider } from "ethers";
import NFT from '../../../abi/nft.json';
import Web3 from 'web3';
import {ethers} from 'ethers';
const EventDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeDataURL, setQRCodeDataURL] = useState('');

  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const { exampleProps } = useStateContext();
  const { name1, imageUrl, imageUrl2, id, description, location, organizer } = exampleProps;
  const [jsonUrl, setJsonUrl] = useState('');
  const { address , status} = useStateContext();
  const NFT_CONTRACT_ADDRESS = "0x0df9139fdd2ef39d923878b2342fd52eeecc92d2";
    const [isWalletInstalled, setIsWalletInstalled] = useState(false);
    const [NFTContract, setNFTContract] = useState(null);
   
  const state = {
    name1: name1,
    description: description,
    location: location,
    organizer: organizer,
    imageUrl: imageUrl,
    imageUrl: imageUrl2,
    id: id,
  };
  console.log(state);
  console.log(state.pId);
  console.log(address);
  const date = new Date();
  const formattedDate = `${date.getDate()} ${date.toLocaleString('default', {
    month: 'short',
  })} ${date.getFullYear()}`;

  const handleupVoteCall = async (id) => {
    setIsLoading(true);
    // Simulating upVote functionality
    console.log(`UpVote called for ID: ${id}`);
    setIsLoading(false);
  };

  const handleDonate = async () => {
    setIsFormVisible(true);
  };

  // const handleCloseForm =async () => {
  //   try {
  //     // Make API call to generate QR code and get the IPFS URL
  //     const response = await fetch('/api/qr/generate-qr', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ userName }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setGeneratedUrl(data.ipfsUrl);
  //       console.log(data.ipfsUrl);
  //       setGeneratedUrl(data.ipfsUrl);
  //     } else {
  //       console.error('Failed to generate QR code:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error generating QR code:', error);
  //   }
  //  // setIsFormVisible(false);
  //  // setUserName('');
  // };
  const handleCloseForm = async () => {
    try {
      // Make API call to generate QR code and get the IPFS URL
      const response = await fetch('/api/qr/generate-qr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          email: document.getElementById('email').value,
          eventName: state?.title,
          address:address, 
          id:state?.id
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.qrCodeIpfsUrl);
        console.log(data.metadataIpfsUrl);
        setGeneratedUrl(data.qrCodeIpfsUrl2);
        setJsonUrl(data.metadataIpfsUrl2); // Set the JSON URL here
        //const BigNumber = require('ethers').BigNumber;
        // Assuming 0.0001 represented as 10000
        // Assuming 0.0001 represented as 10000
        //const amountInWei = Web3.utils.toWei('0.00001', 'ether');
const ticketId = await NFTContract.mintNFT(2, address, data.metadataIpfsUrl2);
        await ticketId.wait();
        console.log(`Event created with ID: ${eventIdForCreateEvent}`);
      } else {
        console.error('Failed to generate QR code:', response.statusText);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
   // setIsFormVisible(false);
   // setUserName('');
  };
  useEffect(() => {
    function initNFTContract () {
      const provider = new BrowserProvider(window.ethereum);
      provider.getSigner().then((signer) => {
        const currentAddress = signer.getAddress();

    console.log("Current Address:", currentAddress);
        setNFTContract(new Contract(NFT_CONTRACT_ADDRESS, NFT.abi, signer));
        console.log("NFT contract successfully initialized");
      }).catch((error) => {
        console.error("Error initializing contract:", error);
      });
    }
    initNFTContract();
  }, []);
  const downloadQRCodeImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
  
      // Create a link element
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
  
      // Set the filename
      link.download = 'qr-code-image.png'; // You can set the desired file name and format
  
      // Append the link to the document
      document.body.appendChild(link);
  
      // Trigger a click on the link to start the download
      link.click();
  
      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading QR code image:', error);
    }
  };
  
  const handleGenerateQRCode = () => {
    // Generate QR code based on the user's name
    // You can use any QR code generation logic or library here
    // For this example, I'll use a simple string concatenation
    const qrCodeData = `User: ${address} , id:${state?.id}`;
    return <QRCode value={qrCodeData} />;
   
  };

  const handleClickOutside = (event) => {
    if (event.target === document.querySelector('.bg-black.bg-opacity-50')) {
      setIsFormVisible(false);
      setUserName('');
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      handleClickOutside(event);
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);
//
  return (
    <>
      <div>
        {isLoading && <p>Loading...</p>}
        <div className="overflow-x-hidden" style={{ marginTop: -100, zIndex: -1 }}>
          <div className="bg-white mt-16">
        
            <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
              <div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
                
                <div className="lg:row-end-1 lg:col-span-4">
                  <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden ">
                  <div className="bg-black align-middle flex items-center justify-center">
    <WalletConnect />
</div>

                 
                    <Image
                      src={img}
                      alt={state?.name}
                      className="object-center object-cover w-full"
                    />
                  </div>
                </div>
                <div className="max-w-2xl mx-auto mt-14 sm: lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-3">
                  <div className="flex flex-col-reverse">
                    {/* <h2>{state?.pId}</h2> */}
                    <div className="flex ">
                      
                    </div>
                  </div>
                  <div className="my-2 flex-col sm:flex-row flex sm:flex-none  items-start font-bold text-gray-900 text-xl  sm:items-center ">
                    <div className="sm:mb-0 mx-1 mb-2">Event time </div>
                    <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-gray-900 sm:text-3xl">
                        {`${state?.id}`}
                      </h1>
                    <div className="">{formattedDate}</div>
                  </div>
                  <div className="my-2 flex-col sm:flex-row flex sm:flex-none  items-start font-bold text-gray-900 text-xl  sm:items-center ">
                    <div className="sm:mb-0 mx-1 mb-2">
                      <IoLocationSharp className=" mr-1 " />
                    </div>
                    <div className="">{` ${state?.location}`}</div>
                  </div>

                  <div className="text-gray-500 font-medium text-base mt-6">
                    {state?.description}
                  </div>
                  <div className="mt-3 flex">
                    
                  </div>
                </div>
              </div>
              <div className="">
                <div className="mt-4  w-[700px] bg-gray-100 rounded-xl prose prose-sm text-gray-900">
                  <div className="max-w-sm p-3 sm:flex  sm:space-x-6  ">
                    <div className="sm:flex-shrink-0 mx-auto sm:mx-0  mb-6 h-10   sm:mb-0">
                      {/* Sample Profile Image */}
                    </div>
                    <div className="flex flex-col space-y-4">
                      <div>
                        <h2 className="text-2xl w-96 font-semibold">{state?.organizer}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="mt-[20px] flex flex-col p-4 bg-sky-100 rounded-[10px]">
                  <p className="font-epilogue font-extrabold text-[28px] leading-[30px] text-center text-blue-900">
                    Event Booking
                  </p>
                  <div className="mt-[30px]">
                    <div className="my-[20px] p-4  bg-sky-100 rounded-[10px]">
                      <h4 className="font-epilogue font-semibold text-[24px] leading-[22px] text-blue-900">
                        Buy your tickets and claim it as NFT
                      </h4>
                      <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-blue-900">
                        How cool's that 😎
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-full bg-sky-500 py-3 text-white font-epilogue font-semibold rounded-[10px] hover:bg-sky-400 focus:outline-none focus:ring focus:border-sky-300"
                      onClick={handleDonate}
                    >
                      Book your tickets
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up form */}
      {isFormVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-md">
            {/* Form content */}
            <h2 className="text-2xl font-bold mb-4">Booking Form</h2>
            <form>
              {/* Form fields go here */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <button
  type="button"
  className={`bg-sky-500 text-white p-2 rounded-md hover:bg-sky-400 ${status === "Connect Wallet" ? 'cursor-not-allowed opacity-50' : ''}`}
  onClick={handleCloseForm}
  disabled={status === "Connect Wallet"}
>
  {status === "Connect Wallet" ? "Connect Wallet First" : "Pay with Crypto"}
</button>
            </form>
            <div className="flex flex-col pt-4">
              <p>Your QR (NFT) 👇</p>
            {userName && handleGenerateQRCode()}
            </div>
            {/* Display QR Code */}
            {generatedUrl && (
                <>
                 <></> <p>Ticket URL: {generatedUrl}</p>
                  {/* Display the QR Code */}
                 <a href="${jsonUrl"> <p>JSON URL: {jsonUrl}</p> </a>{/* Display the JSON URL */}
                  {/* <QRCode value={generatedUrl} /> */}
                  <button
  type="button"
  className="bg-sky-500 text-white p-2 rounded-md hover:bg-sky-400 ml-2"
  onClick={() => downloadQRCodeImage(generatedUrl)}
  disabled={!generatedUrl}
>
  Download QR Code Image
</button>
                </>
              )}
            
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetails;