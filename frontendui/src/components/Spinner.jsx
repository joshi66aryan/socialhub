//imported in feed.jsx
import React from 'react'
import {Circles} from 'react-loader-spinner';


const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <Circles
        height="80"
        width="80"
        color="#00BFFF"
        className ='m-5'
        ariaLabel="circles-loading"
        visible={true}
      />
      <p className='text-lg text-center px-2 '> { message }</p>
    </div>
  )
}

export default Spinner