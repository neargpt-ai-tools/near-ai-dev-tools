// app/components/ParameterForm.js
"use client";


export const ParameterForm = ({ onGenerate }) => {
    const [parameters, setParameters] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setParameters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate(parameters);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="parameter1"
                placeholder="Parameter 1"
                onChange={handleChange}
            />
            <input
                type="text"
                name="parameter2"
                placeholder="Parameter 2"
                onChange={handleChange}
            />
            <button type="submit">Generate Contract</button>
        </form>
    );
};
