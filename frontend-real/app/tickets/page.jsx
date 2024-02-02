// Import necessary dependencies and components
'use client'
import WalletConnect from '@/components/WalletConnect';
import { useState, useEffect } from 'react';
import { useStateContext } from '@/context/eventContext';
import { ethers } from 'ethers';
import { Contract, BrowserProvider } from "ethers";
import NFT from '../../abi/nft.json';
// Create the Tickets component
const Tickets = () => {
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [NFTContract, setNFTContract] = useState(null);
  // Use the context to get the user's public address
  const { address } = useStateContext();
  const NFT_CONTRACT_ADDRESS = "0x0df9139fdd2ef39d923878b2342fd52eeecc92d2";
  // Function to fetch and display the user's tickets
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
  const fetchUserTickets = async () => {
    try {
      setIsLoading(true);

      // Make a call to your smart contract to get the buyer's details
      //const contract = /* Your contract instance */;
      const buyerDetails = await NFTContract.getBuyerDetails(address);

      // Set the tickets in the state
      setTickets(buyerDetails.metaDatas);
        console.log(tickets);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      setIsLoading(false);
    }
  };

  // Use useEffect to fetch user tickets when the component mounts
  useEffect(() => {
    fetchUserTickets();
  }, [address]); // Fetch tickets whenever the address changes

  // Render the component
  return (
    <div>
      <h1>Your Tickets</h1>
      {/* <div className="bg-black align-middle flex items-center justify-center">
    <WalletConnect />
</div> */}
      {/* Display loading spinner if data is still being fetched */}
      {isLoading && <p>Loading...</p>}

      {/* Display the user's tickets */}
      {tickets.length > 0 ? (
        <ul>
          {tickets.map((ticket, index) => (
            <li key={index}>{ticket}</li>
          ))}
        </ul>
      ) : (
        <p>No tickets found.</p>
      )}
    </div>
  );
};

export default Tickets;
