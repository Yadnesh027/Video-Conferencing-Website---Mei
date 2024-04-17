import React from 'react'
import Image from 'next/image'

const Loader = () => {
  return (
    <div className='flex-center flex-col h-screen w-full gap-3'>
      <Image
        src='/icons/loader.svg'
        alt="loading"
        width={150}
        height={150}
      />
      <div className="flex-center w-full gap-3">
        <Image
          src='/icons/logo.svg'
          alt="loading"
          width={50}
          height={50}
        />
        <h2 className='text-white font-bolder text-4xl'>Mei</h2>
      </div>

    </div>
  )
}

export default Loader