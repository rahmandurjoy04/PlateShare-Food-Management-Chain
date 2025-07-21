import React from 'react';
import Banner from './Banner/Banner';
import ImpactStats from './ImpactStats/ImpactStats';
import CommunityStories from './CommunityStories/CommunityStories';
import FeaturedDonations from './FeaturedDonations/FeaturedDonations';
import LatestCharityRequests from './LatestCharityRequests/LatestCharityRequests';

const HomePage = () => {
    return (
        <div className='mx-auto'>
            <Banner></Banner>
            <FeaturedDonations></FeaturedDonations>
            <LatestCharityRequests></LatestCharityRequests>
            <ImpactStats></ImpactStats>
            <CommunityStories></CommunityStories>
        </div>
    );
};

export default HomePage;