import { useState } from "react";

export default function RadioBox({ prices, handleFilters }) {
    
    const [value, setValue] = useState(0);

    const handleChange = event => {
        handleFilters(event.target.value);
        setValue(event.target.value);
    };

    return prices.map((price) => (
        <li key={price._id}>
            <input
                onChange={handleChange}
                value={`${price._id}`}
                name={price}
                type="radio"
            />
            <label style={{fontSize: "14px", fontFamily: 'monospace'}}><strong> { 0 ? value: price.name}</strong></label>
        </li>
    ));
}