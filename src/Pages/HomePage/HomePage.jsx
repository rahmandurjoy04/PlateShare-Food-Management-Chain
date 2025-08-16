import React from 'react';
import Banner from './Banner/Banner';
import ImpactStats from './ImpactStats/ImpactStats';
import CommunityStories from './CommunityStories/CommunityStories';
import FeaturedDonations from './FeaturedDonations/FeaturedDonations';
import LatestCharityRequests from './LatestCharityRequests/LatestCharityRequests';

const HomePage = () => {
    return (
        <div className=''>
            <Banner></Banner>
            <div className='max-w-11/12 mx-auto'>
                <FeaturedDonations></FeaturedDonations>
                <LatestCharityRequests></LatestCharityRequests>
                <ImpactStats></ImpactStats>
                <CommunityStories></CommunityStories>
            </div>
        </div>
    );
};

export default HomePage;