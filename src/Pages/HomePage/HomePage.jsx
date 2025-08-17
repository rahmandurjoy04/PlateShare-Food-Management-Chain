import React from 'react';
import Banner from './Banner/Banner';
import ImpactStats from './ImpactStats/ImpactStats';
import CommunityStories from './CommunityStories/CommunityStories';
import FeaturedDonations from './FeaturedDonations/FeaturedDonations';
import LatestCharityRequests from './LatestCharityRequests/LatestCharityRequests';
import Newsletter from '../Newsletter';

const HomePage = () => {
    return (
        <div className=''>
            <Banner></Banner>
            <div className='max-w-11/12 mx-auto'>
                <FeaturedDonations></FeaturedDonations>
                <LatestCharityRequests></LatestCharityRequests>
                <ImpactStats></ImpactStats>
                <CommunityStories></CommunityStories>
                <Newsletter></Newsletter>
            </div>
        </div>
    );
};

export default HomePage;