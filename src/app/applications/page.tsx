import React from 'react'
import Navbar from "@/components/Navbar";
import MyApplications from '@/components/MyApplication';

const page = () => {
  return (
    <div className="grid grid-cols-12">
    <div className="col-span-2"><Navbar page='Applications' /></div>
    <div className="col-span-10"><MyApplications /></div>
  </div>
  )
}

export default page