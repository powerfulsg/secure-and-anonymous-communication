// eslint-disable-next-line no-unused-vars
import React from 'react'
import Conversations from './Conversations';
import LogoutButton from './LogoutButton';
import ReceiveInput from './receiveInput';

const SideBar = () => {
  return (
    <div className='broder-r broder-slate-500 p-4 flex flex-col'>
      {/* <SearchInput/> */}
      {/* <div className='divider px-3'></div> */}
      <Conversations/>
      <ReceiveInput />
      <LogoutButton/>
    </div>
  )
}

export default SideBar;
