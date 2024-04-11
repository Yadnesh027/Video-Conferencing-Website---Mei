import React from 'react'
import Image from 'next/image'
import {cn} from '@/lib/utils'

interface HomeCardProps {
    className: string,
    img: string,
    title: string,
    description: string,
    handleClick: () => void;
}

const HomeCard = ( { className, img, title, description, handleClick }: HomeCardProps ) => {
  return (
    <section>
        <div className={cn('bg-gradient-to-br from-[#F0CB35] to-[#C02425]  px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] backdrop-blur-lg min-h-[260px] rounded-[14px] cursor-pointer', className)} onClick={handleClick}>
            <div className='flex-center glassmorphism size-12 rounded-[10px]'>
                <Image src={img} alt="meeting" width={25} height={25} />
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">
                    {title}
                </h1>
                <p className="text-lg font-normal">
                    {description}
                </p>
            </div>
        </div>
    </section>
  )
}

export default HomeCard