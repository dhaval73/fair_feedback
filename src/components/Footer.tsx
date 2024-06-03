

import React from 'react'
import { Separator } from './ui/separator'
import Link from 'next/link'

const Footer = async () => {
  return (
    <div className='w-full text-center pb-2 '>
        <Separator className='mb-2' />
        ©2024 <Link
        href='/'>
        Fair Feedback 
        </Link> - All rights reserved.
    </div>
  )
}

export default Footer