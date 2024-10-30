'use client';
import React, { useState, useEffect, useContext } from 'react';
import { Cards } from '@/components/cards';
import { NearContext } from '@/wallets/near';
import { HelloNearContract } from '@/config';
import Section from '@/components/Section';
import styles from '@/app/app.module.css';


// Contract that the app will interact with
const CONTRACT = HelloNearContract;

export default function Home() {
  const [functionsInput, setFunctionsInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => { });
  const [label, setLabel] = useState('Loading...');

  useEffect(() => {
    if (!wallet) return;

    if (signedAccountId) {
      setAction(() => wallet.signOut);
      setLabel(`Logout ${signedAccountId}`);
    } else {
      setAction(() => wallet.signIn);
      setLabel('Login');
    }
  }, [signedAccountId, wallet]);

  useEffect(() => {
    setLoggedIn(!!signedAccountId);
  }, [signedAccountId]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  const handleGenerateCode = async () => {
    if (!functionsInput) return;

    setShowSpinner(true);
    try {
        const response = await fetch('http://localhost:8080/api/openai/generate-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Update this body to include the correct parameters
            body: JSON.stringify({ 
                prompt: functionsInput, 
                lang: 'ts' 
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate code');
        }

        const data = await response.json();
        setGeneratedCode(data.aiResponse); // Update this to match the expected response structure
    } catch (error) {
        console.error("Error generating code:", error);
    } finally {
        setShowSpinner(false);
    }
};

  const handleEdit = () => {
    console.log("Editing the code...");
  };

  const handleDeploy = async () => {
    if (!generatedCode) return;

    setShowSpinner(true);
    try {
      await wallet.callMethod({
        contractId: CONTRACT,
        method: 'deploy_contract',
        args: { code: generatedCode },
      });
      alert('Contract deployed successfully!');
    } catch (error) {
      console.error("Error deploying contract:", error);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleTest = async () => {
    if (!generatedCode) return;

    console.log("Testing the contract...");
  };

  return (
    <Section className="flex flex-wrap gap-10 mb-10">
         <div className="max-w-md mx-auto p-6 md:p-8 lg:p-10 bg-grey rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">AI Smart Contract Generator</h1>
      
      {!loggedIn ? (
        <div>
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition" onClick={action}>
            {label}
          </button>
        </div>
      ) : (
        <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem]"> 
          <textarea
            placeholder="Enter functions for your smart contract"
            value={functionsInput}
            onChange={e => setFunctionsInput(e.target.value)}
          />
          <button className={`flex items-center mt-10 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition ${!functionsInput && 'opacity-50 cursor-not-allowed'}`} onClick={handleGenerateCode} disabled={!functionsInput}>
            {showSpinner ? 'Generating...' : 'Generate Code'}
          </button>

          {generatedCode && (

            <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-xl font-semibold mb-2">Generated Code:</h2>
            <pre className="border border-gray-300 p-4 overflow-x-auto max-w-[62rem] text-center">{generatedCode}</pre>
            <div className="flex gap-2 mt-4">
              <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition" onClick={handleEdit}>Edit Code</button>
              <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition" onClick={handleDeploy}>Deploy</button>
              <button className="bg-teal-500 text-white font-bold py-2 px-4 rounded hover:bg-teal-600 transition" onClick={handleTest}>Test</button>
            </div>
          </div>  
          )}
        </div>
      )}
    </div>
    </Section>
 
  );
}
