import { useState } from "react";


export default function Checkbox({ categories, handleFilters }) {
    const [checked, setCheked] = useState([]);

    const handleToggle = category => () => {
        // return the first index or -1
        const currentCategoryId = checked.indexOf(category);
        const newCheckedCategoryId = [...checked];
        // if currently checked was not already in checked state > push
        // else pull/take off
        if (currentCategoryId === -1) {
            newCheckedCategoryId.push(category);
        } else {
            newCheckedCategoryId.splice(currentCategoryId, 1);
        }
        // console.log(newCheckedCategoryId);
        setCheked(newCheckedCategoryId);
        handleFilters(newCheckedCategoryId);
    };

    return categories.map(category => (
        <li key={category._id}>
            <input
                onChange={handleToggle(category._id)}
                value={checked.indexOf(category._id === -1)}
                type="checkbox"
            />
            <label style={{fontSize: "14px", fontFamily: 'monospace'}}><strong> {category.title}</strong></label>
        </li>
    ));
}