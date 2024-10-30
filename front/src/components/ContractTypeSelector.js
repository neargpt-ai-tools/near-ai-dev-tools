// app/components/ContractTypeSelector.js
"use client";


export const ContractTypeSelector = ({ onChange }) => {
    const contractTypes = ['Type A', 'Type B', 'Type C'];

    return (
        <select onChange={(e) => onChange(e.target.value)}>
            <option value="">Select Contract Type</option>
            {contractTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
            ))}
        </select>
    );
};

