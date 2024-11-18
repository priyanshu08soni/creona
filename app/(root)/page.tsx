import CanvasWithText from '@/components/shared/Canvas'
import React from 'react'
const Home = async () => {

  return (
    <div className='main-container'>
      <section className='home' >
        <h1 className='home-heading' >
          CREONA - CREATE YOUR OWN DESIGN
        </h1>
      </section>
      <section className='sm:mt-12' >
        <CanvasWithText/>
      </section>
    </div>
  )
}

export default Home
