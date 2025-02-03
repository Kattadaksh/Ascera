// for investors to create their profile

import { useState } from "react"

const InvestorProfile = () => {
  const [profile, isProfile] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    isProfile(true);
  }

  return (
    <>
    <h1>Profile Creation</h1>
    <form onSubmit={handleSubmit} >
      <input placeholder ='Enter your name'></input> 
      <button type='submit'>Submit</button></form> 


    </>
  )
}

export default InvestorProfile