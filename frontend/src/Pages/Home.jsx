import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
    {/* header */}
    <div className='bg-rose-500 flex justify-between p-5 px-8'>
        <div className='text-white text-2xl'>Shivani Shagun</div>
        <Link to='/AdminLogin' className='border rounded-lg bg-amber-500 text-white p-2 px-3'>Admin</Link>
    </div>
    </>
  )
}

export default Home