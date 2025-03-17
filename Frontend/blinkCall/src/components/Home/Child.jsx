import React from 'react'


const Child = ( { text, handleChange } ) => {



    return (
        <div>
            <h1 className='mt-10 text-white font-semibold '>Text: {text}</h1>
                <input onChange={(e) => handleChange(e.target.value)} type="text" value={text} placeholder='something'/>


        </div>
    )


}


export default Child;