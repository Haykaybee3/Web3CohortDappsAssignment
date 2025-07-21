import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0x13103aE089Ae8c0C60837B1BFD0102EF4070F295";

function App() {
  const [text, setText] = useState("");
  const [retrievedMessage, setRetrievedMessage] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text); 
        const txReceipt = await tx.wait();
        console.log("Transaction successful:", txReceipt);
      } else {
        console.error("MetaMask not found. Please install MetaMask to use this application.");
      }
    } catch (error) {
      console.error("Error setting message:", error);
      alert(error.message || error);
    }
  };

  const handleGet = async () => {
    try {
      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const message = await contract.getMessage();
        setRetrievedMessage(message);
        console.log("Message retrieved:", message);
      } else {
        console.error("MetaMask not found. Please install MetaMask to use this application.");
      }
    } catch (error) {
      console.error("Error getting message:", error);
      alert(error.message || error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Set Message on Smart Contract</h1>
      
      <div style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Set message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={handleSet}>Set Message</button>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <button onClick={handleGet} style={{ marginRight: "1rem" }}>Get Message</button>
        
        {retrievedMessage && (
          <div style={{ 
            marginTop: "1rem", 
            padding: "1rem", 
            backgroundColor: "#f0f0f0", 
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}>
            <strong>Retrieved Message:</strong> {retrievedMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;