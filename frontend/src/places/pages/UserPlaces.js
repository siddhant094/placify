import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Vidhan Soudha',
        description:
            'One of the must visit places in Bangalore having an amazing Architecture',
        imageUrl:
            'https://www.holidify.com/images/cmsuploads/compressed/attr_wiki_2838_20190305154327.jpg',
        address:
            'Vidhana Soudha, Devaraj Urs Rd, Ambedkar Veedhi, Sampangi Rama Nagar, Bengaluru, Karnataka 560001',
        location: {
            lat: 28.6260722,
            lng: 77.366896,
        },
        creator: 'u1',
    },
    {
        id: 'p2',
        title: 'Cannaught Place',
        description:
            'One of the must visit places in Delhi having an old British Style Architecture',
        imageUrl:
            'https://static.toiimg.com/thumb/msid-92247397,width-748,height-499,resizemode=4,imgsize-105112/.jpg',
        address:
            'Vidhana Soudha, Devaraj Urs Rd, Ambedkar Veedhi, Sampangi Rama Nagar, Bengaluru, Karnataka 560001',
        location: {
            lat: 28.6260722,
            lng: 77.366896,
        },
        creator: 'u2',
    },
];

const UserPlaces = (props) => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(
        (place) => place.creator === userId
    );
    return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
