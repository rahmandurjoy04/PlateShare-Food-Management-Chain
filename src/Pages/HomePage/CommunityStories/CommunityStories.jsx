// import React from 'react';
// import { FaQuoteLeft } from 'react-icons/fa';
// import { Typewriter } from 'react-simple-typewriter';

// const stories = [
//     {
//         id: 1,
//         name: "Hope's Kitchen",
//         role: 'Charity Partner',
//         message:
//             "Thanks to PlateShare, we're now able to provide hundreds of meals every week. Their system is seamless and truly impactful.",
//         image: 'https://i.ibb.co/dwY22F2b/hc-1.png',
//     },
//     {
//         id: 2,
//         name: 'Spice Garden',
//         role: 'Restaurant Donor',
//         message:
//             "We used to waste food daily, but now it's helping people in need. PlateShare made the process easy and rewarding.",
//         image: 'https://i.ibb.co/5hf6Q4b4/sg.png',
//     },
//     {
//         id: 3,
//         name: 'Meals of Love',
//         role: 'Charity Volunteer',
//         message:
//             "The donations we receive through PlateShare feed so many families. It's more than just food—it's hope.",
//         image: 'https://i.ibb.co/G4vw9m3b/ml.jpg',
//     },
// ];

// const CommunityStories = () => {
//     return (
//         <section className="bg-blue-50 py-14 px-4 md:px-10">
//             <div className="max-w-7xl mx-auto text-center">
//                 <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
//                     Community Stories
//                 </h2>

//                 <p className="text-blue-700 mb-10 text-sm md:text-base max-w-xl mx-auto">
//                     <Typewriter
//                         words={['Hear from the people making a difference—how PlateShare is helping charities, restaurants, and communities come together to fight food waste.']}
//                         loop={0}
//                         cursor
//                         cursorStyle="|"
//                         typeSpeed={80}
//                         deleteSpeed={50}
//                         delaySpeed={10000}
//                     />
//                 </p>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-3 lg:grid-rows-1 gap-6">
//                     {/* Card 1 */}
//                     <div className="group card bg-white shadow-lg p-6 rounded-xl flex flex-col items-center relative transition-transform duration-300 hover:scale-105 hover:shadow-blue-200">
//                         <FaQuoteLeft className="text-amber-600 text-2xl absolute top-4 left-4 opacity-50 transition-colors duration-300 group-hover:text-yellow-700" />
//                         <p className="text-gray-700 mb-6 mt-6 italic text-center">
//                             “{stories[0].message}”
//                         </p>
//                         <div className="flex items-center gap-4 mt-auto">
//                             <img
//                                 src={stories[0].image}
//                                 alt={stories[0].name}
//                                 className="w-12 h-12 rounded-full object-cover"
//                             />
//                             <div>
//                                 <p className="font-semibold text-blue-800">{stories[0].name}</p>
//                                 <p className="text-xs text-blue-600">{stories[0].role}</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Card 2 */}
//                     <div className="group card bg-white shadow-lg p-6 rounded-xl flex flex-col items-center relative transition-transform duration-300 hover:scale-105 hover:shadow-blue-200">
//                         <FaQuoteLeft className="text-green-600 text-2xl absolute top-4 left-4 opacity-50 transition-colors duration-300 group-hover:text-green-800" />
//                         <p className="text-gray-700 mb-6 mt-6 italic text-center">
//                             “{stories[1].message}”
//                         </p>
//                         <div className="flex items-center gap-4 mt-auto">
//                             <img
//                                 src={stories[1].image}
//                                 alt={stories[1].name}
//                                 className="w-12 h-12 rounded-full object-cover"
//                             />
//                             <div>
//                                 <p className="font-semibold text-blue-800">{stories[1].name}</p>
//                                 <p className="text-xs text-blue-600">{stories[1].role}</p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Card 3 (Centered in second row on tablet) */}
//                     <div className="group card bg-white shadow-lg p-6 rounded-xl flex flex-col items-center relative transition-transform duration-300 hover:scale-105 hover:shadow-blue-200 md:col-span-2 md:row-start-2 md:mx-auto md:max-w-md lg:col-span-1 lg:row-start-auto lg:max-w-none">
//                         <FaQuoteLeft className="text-cyan-600 text-2xl absolute top-4 left-4 opacity-50 transition-colors duration-300 group-hover:text-teal-700" />
//                         <p className="text-gray-700 mb-6 mt-6 italic text-center">
//                             “{stories[2].message}”
//                         </p>
//                         <div className="flex items-center gap-4 mt-auto">
//                             <img
//                                 src={stories[2].image}
//                                 alt={stories[2].name}
//                                 className="w-12 h-12 rounded-full object-cover"
//                             />
//                             <div>
//                                 <p className="font-semibold text-blue-800">{stories[2].name}</p>
//                                 <p className="text-xs text-blue-600">{stories[2].role}</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default CommunityStories;



import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Typewriter } from 'react-simple-typewriter';

const stories = [
    {
        id: 1,
        name: "Hope's Kitchen",
        role: 'Charity Partner',
        message:
            "Thanks to PlateShare, we're now able to provide hundreds of meals every week. Their system is seamless and truly impactful.",
        image: 'https://i.ibb.co/dwY22F2b/hc-1.png',
    },
    {
        id: 2,
        name: 'Spice Garden',
        role: 'Restaurant Donor',
        message:
            "We used to waste food daily, but now it's helping people in need. PlateShare made the process easy and rewarding.",
        image: 'https://i.ibb.co/5hf6Q4b4/sg.png',
    },
    {
        id: 3,
        name: 'Meals of Love',
        role: 'Charity Volunteer',
        message:
            "The donations we receive through PlateShare feed so many families. It's more than just food—it's hope.",
        image: 'https://i.ibb.co/G4vw9m3b/ml.jpg',
    },
];

const CommunityStories = () => {
    return (
        <section className="bg-blue-50 py-14 px-4 md:px-10">
            <h2 className="text-3xl text-center md:text-4xl font-bold text-blue-900 mb-4">
                Community Stories
            </h2>
            <p className="text-blue-700 text-center mb-10 text-sm md:text-base max-w-xl mx-auto">
                <Typewriter
                    words={['Hear from the people making a difference—how PlateShare is helping charities, restaurants, and communities come together to fight food waste.']}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={80}
                    deleteSpeed={50}
                    delaySpeed={10000}
                />
            </p>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-8">
                {/* Image on the Left */}
                <div className="w-full md:w-1/2 flex flex-col py-6 justify-center items-center">
                    <h1 className='text-4xl text-teal-600 text-center font-bold'>
                        What Partners Say About PlateShare
                    </h1>
                    <p className='text-center text-teal-800 mt-6'>"Real stories from the people, charities, and restaurants who are making a difference through food rescue and community impact"</p>
                </div>

                {/* Slider Section */}
                <div className="w-full rounded-xl md:w-1/2">


                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={20}
                        slidesPerView={1}
                        autoplay={{
                            delay: 3000, // 3 seconds delay between slides
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next',
                            prevEl: '.swiper-button-prev',
                        }}
                        className="relative"
                    >
                        {stories.map((story) => (
                            <SwiperSlide key={story.id}>
                                <div className="group card rounded bg-white shadow-lg p-6 flex flex-col items-center relative transition-transform duration-300 hover:shadow-blue-200">
                                    <FaQuoteLeft
                                        className={`text-${story.id === 1 ? 'amber-600' : story.id === 2 ? 'green-600' : 'cyan-600'
                                            } text-2xl absolute top-4 left-4 opacity-50 transition-colors duration-300 group-hover:text-${story.id === 1 ? 'yellow-700' : story.id === 2 ? 'green-800' : 'teal-700'
                                            }`}
                                    />
                                    <p className="text-gray-700 mb-6 mt-6 italic text-center">
                                        “{story.message}”
                                    </p>
                                    <div className="flex items-center gap-4 mt-auto">
                                        <img
                                            src={story.image}
                                            alt={story.image}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-blue-800">{story.name}</p>
                                            <p className="text-xs text-blue-600">{story.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full  transition-colors duration-300 z-10"></div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full  transition-colors duration-300 z-10"></div>
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default CommunityStories;