import React from 'react'
import UsersList from '../components/UsersList'

const Users = () => {
    const USERS = [
        {
            id: 'u1',
            name: 'Siddhant Pandey',
            image: 'https://picsum.photos/600/600',
            places: 12,
        },
        {
            id: 'u2',
            name: 'Narendra Modi',
            image: 'https://picsum.photos/600/600',
            places: 2,
        },
    ]

    return <UsersList items={USERS} />
}

export default Users
