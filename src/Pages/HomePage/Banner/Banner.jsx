import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import slider_1 from '../../../assets/slider-1.png';
import slider_2 from '../../../assets/slider-2.webp';
import slider_3 from '../../../assets/slider-3.webp';

const Banner = () => {
    return (
        <div className="w-full p-0 m-0 min-w-sm">
            <Carousel
                showThumbs={false}
                infiniteLoop
                autoPlay
                interval={3000}
                showStatus={false}
                swipeable
                emulateTouch
                // showArrows={false}
            >
                <div>
                    <img 
                        src={slider_1} 
                        alt="slide 1" 
                        className="w-full h-[500px] object-cover" 
                    />
                </div>
                <div>
                    <img 
                        src={slider_2} 
                        alt="slide 2" 
                        className="w-full h-[500px] object-cover" 
                    />
                </div>
                <div>
                    <img 
                        src={slider_3} 
                        alt="slide 3" 
                        className="w-full h-[500px] object-cover" 
                    />
                </div>
            </Carousel>
        </div>
    );
};

export default Banner;
