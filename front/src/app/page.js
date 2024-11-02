'use client';
import React, { useState, useEffect, useContext } from 'react';
import { NearContext } from '@/wallets/near';
import { HelloNearContract } from '@/config';
import Section from '@/components/Section';

const CONTRACT = HelloNearContract;

export default function Home() {
  const [functionsInput, setFunctionsInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [editableCode, setEditableCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const { signedAccountId, wallet } = useContext(NearContext);
  const [action, setAction] = useState(() => {});
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

  const handleGenerateCode = async () => {
    if (!functionsInput) return;

    setShowSpinner(true);
    try {
      const response = await fetch('http://localhost:8080/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: functionsInput,
          lang: 'ts'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate code');
      }

      const data = await response.json();
      setGeneratedCode(data.aiResponse);
      setEditableCode(data.aiResponse); // Initialize editable code with generated code
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleDeploy = async () => {
    if (!editableCode) return;

    setShowSpinner(true);
    try {
      await wallet.callMethod({
        contractId: CONTRACT,
        method: 'deploy_contract',
        args: { code: editableCode },
      });
      alert('Contract deployed successfully!');
    } catch (error) {
      console.error("Error deploying contract:", error);
    } finally {
      setShowSpinner(false);
    }
  };

  const handleTest = async () => {
    if (!editableCode) return;
    console.log("Testing the contract...");
  };

  return (
    <Section className="flex flex-wrap gap-10 mb-10">
      <div className="max-w-md mx-auto p-6 md:p-8 lg:p-10 bg-grey rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">AI-Generated Smart Contracts on NEAR</h1>

        {!loggedIn ? (
          <div>
            <button className="bg-blue-500 text-white font-bold py-2 px-12 rounded hover:bg-blue-700 transition" onClick={action}>
              {label}
            </button>
          </div>
        ) : (
          <div className="relative z-2 flex flex-col ">
            <textarea
              placeholder="Enter functions for your smart contract"
              value={functionsInput}
              onChange={e => setFunctionsInput(e.target.value)}
              className="max-w-md p-6 md:p-8 lg:p-10 bg-aqua rounded-lg shadow-md"
            />
            <button className={`flex items-center mt-10 bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition ${!functionsInput && 'opacity-50 cursor-not-allowed'}`} onClick={handleGenerateCode} disabled={!functionsInput}>
              {showSpinner ? 'Generating...' : 'Generate Code'}
            </button>

            {generatedCode && (
              <div className="flex flex-col items-center justify-center h-screen mt-4">
                <h2 className="text-xl font-semibold mb-2">Generated Code:</h2>
                {isEditing ? (
                  <textarea
                    value={editableCode}
                    onChange={e => setEditableCode(e.target.value)}
                    className="border border-gray-300 p-4 overflow-x-auto max-w-[62rem] text-left"
                  />
                ) : (
                  <pre className="border border-gray-300 p-4 overflow-x-auto max-w-[62rem] text-left">{editableCode}</pre>
                )}
                <div className="flex gap-2 mt-4">
                  <button className="bg-yellow-500 text-white font-bold py-2 px-4 rounded hover:bg-yellow-600 transition" onClick={handleEditToggle}>
                    {isEditing ? 'Save' : 'Edit Code'}
                  </button>
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