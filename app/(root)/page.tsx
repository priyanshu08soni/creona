
import { navLinks } from '@/constants'
import { UserButton } from '@clerk/nextjs'
import { LogIn } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
const Home = async ({searchParams} : SearchParamProps) => {

  return (
    <>
      <section className='home' >
        <h1 className='home-heading'>
          Make Your Creative Design Using Creona
        </h1>
      </section>
      <section className='sm:mt-12' >
      </section>
    </>
  )
}

export default Home
