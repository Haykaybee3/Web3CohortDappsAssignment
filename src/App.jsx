import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0x13103aE089Ae8c0C60837B1BFD0102EF4070F295";

function App() {
  const [text, setText] = useState("");
  const [retrievedMessage, setRetrievedMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const handleSet = async () => {
    try {
      setError("");
      setLoading(true);

      if (!text) {
        setError("Please enter a message before setting.");
        return;
      }

      if (!window.ethereum) {
        setError("MetaMask not found. Please install MetaMask to use this application.");
        return;
      }

      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const tx = await contract.setMessage(text); 
      const txReceipt = await tx.wait();
      console.log("Transaction successful:", txReceipt);
      
      setText("");
      setError("");
      
    } catch (error) {
      console.error("Error setting message:", error);
      setError(`Error setting message: ${error.message || error.reason || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGet = async () => {
    try {
      setError("");
      setLoading(true);

      if (!window.ethereum) {
        setError("MetaMask not found. Please install MetaMask to use this application.");
        return;
      }

      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const message = await contract.getMessage();
      setRetrievedMessage(message);
      console.log("Message retrieved:", message);
      setError("");
      
    } catch (error) {
      console.error("Error getting message:", error);
      setError(`Error getting message: ${error.message || error.reason || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Set Message on Smart Contract</h1>
      
      {error && (
        <div style={{ 
          background: "#ffebee", 
          color: "#c62828", 
          padding: "1rem", 
          borderRadius: "4px", 
          marginBottom: "1rem",
          border: "1px solid #ef5350"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Set message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ 
            marginRight: "0.5rem",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "250px"
          }}
          disabled={loading}
        />
        <button 
          onClick={handleSet}
          disabled={loading}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: loading ? "#ccc" : "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Setting..." : "Set Message"}
        </button>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <button 
          onClick={handleGet} 
          disabled={loading}
          style={{ 
            marginRight: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: loading ? "#ccc" : "#388e3c",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Getting..." : "Get Message"}
        </button>
        
        {retrievedMessage && (
          <div style={{ 
            marginTop: "1rem", 
            padding: "1rem", 
            backgroundColor: "#e8f5e8", 
            borderRadius: "4px",
            border: "1px solid #4caf50"
          }}>
            <strong>Retrieved Message:</strong> {retrievedMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;