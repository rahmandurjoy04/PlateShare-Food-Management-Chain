import React from 'react';
import Banner from './Banner/Banner';
import ImpactStats from './ImpactStats/ImpactStats';
import CommunityStories from './CommunityStories/CommunityStories';

const HomePage = () => {
    return (
        <div className='mx-auto'>
            <Banner></Banner>
            <ImpactStats></ImpactStats>
            <CommunityStories></CommunityStories>
        </div>
    );
};

export default HomePage;