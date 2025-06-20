import React from 'react';
// import Header from '../Components/Header';
import HeroBanner from '../Components/HeroBanner';
import FeatureSection from '../Components/FeatureSection';
import RoommateSection from '../Components/RoommateSection';
import HousingSection from '../Components/HousingSection';
import Footer from '../Components/Footer';
import '../Components/ScrollToTop'; // ScrollToTop 컴포넌트 추가
import '../Pages/css/Main.css'; // CSS 파일 추가

const Main = () => {

    return (
        <div>
            {/* <Header /> */}
            <HeroBanner />
            <FeatureSection />
            <RoommateSection />
            <HousingSection />
            <Footer />
        </div>
    );
};

export default Main;
