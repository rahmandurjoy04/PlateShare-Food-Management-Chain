import React from 'react';
import Banner from './Banner/Banner';
import ImpactStats from './ImpactStats/ImpactStats';
import CommunityStories from './CommunityStories/CommunityStories';
import FeaturedDonations from './FeaturedDonations/FeaturedDonations';

const HomePage = () => {
    return (
        <div className='mx-auto'>
            <Banner></Banner>
            <FeaturedDonations></FeaturedDonations>
            <ImpactStats></ImpactStats>
            <CommunityStories></CommunityStories>
        </div>
    );
};

export default HomePage;