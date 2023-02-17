import React from 'react';

export default function InputFields({
    index,
    handleChange,
    handleDelete,
    state
}) {
    return (
        <div className="InputBox" key={index}>
            {' '}
            <div>
                <input
                    type="text"
                    name="origin"
                    placeholder="latitude"
                    onChange={handleChange(index, 0)}
                    className="Input"
                    value={state[index][0] || ''}
                />
                <input
                    type="text"
                    name="destination"
                    placeholder="longitude"
                    onChange={handleChange(index, 1)}
                    className="Input"
                    value={state[index][1] || ''}
                />
            </div>
            {state.length > 2 && (
                <button onClick={handleDelete(index)}>Delete</button>
            )}
            <p className="YellowText">
                {index === 0 ? 'Source' : `Destination ${index}`}
            </p>
        </div>
    );
}
