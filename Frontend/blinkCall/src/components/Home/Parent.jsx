import React, {useState} from 'react'
import Child from './Child';

const Parent = () => {

    const [text , setText] = useState('Now');

    const handleChange = (value) => {

        setText(value);
    }

    return (
            <>
                    <h1>Text: {text}</h1>

                <Child text={text} handleChange={handleChange} />
            </>

    )

}

export default Parent;