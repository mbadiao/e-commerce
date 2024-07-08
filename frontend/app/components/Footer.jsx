import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className='flex flex-col text-black-100 mt-5 border-t border-gray-100'>
        <div className='flex max-md:flex-col flex-wrap justify-between gap-5 sm:px-16
        px-7 py-10'>
            <div className='flex flex-col justify-normal
            items-start gap-6'>
                <Image
                src="/logo.svg"
                width={48}
                height={18}
                alt='footer logo'
                className='object-contain'
                />
                <p className='text-base text-gray-700'>
                    MyShop 2024 All rights reserved &copy;
                 </p>
            </div>
            <div className='footer_links gap-3'>
                 <Link href='home'>Home </Link>
                 <Link href='produts'>Products</Link>
            </div>
        </div>

    </footer>
  )
}

export default Footer