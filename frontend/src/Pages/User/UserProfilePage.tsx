import React from 'react'
import UserProfile from '../../Components/Users/UserProfile'
import UserNav from '../../Components/Users/UserNav'
import UserSidebar from '../../Components/Users/UserSidebar'

function UserProfilePage() {
  return (
    <div className="flex flex-col h-screen">
    <UserNav />
    <div className="flex flex-grow">
        <UserSidebar />
        <main className="flex-grow ml-16 pt-16 p-4 bg-gray-100">
            <UserProfile />
        </main>
    </div>
</div>
  )
}

export default UserProfilePage
