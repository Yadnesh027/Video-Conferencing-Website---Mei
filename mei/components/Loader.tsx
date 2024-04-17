import React from 'react'
import Image from 'next/image'

const Loader = () => {
  return (
    <div className='flex-center h-screen w-full'>
      <Image 
            src='/icons/loader.svg'    
            alt="loading"
            width={200}
            height={200}
        />
      
    </div>
  )
}

export default Loader