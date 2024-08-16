import React from 'react'
import Navbar from '../../Components/Users/Navbar'
import HeroSection from '../../Components/Users/Home/HeroSection'
import ServicesSection from '../../Components/Users/Home/ServiceSection'
import Footer from '../../Components/Users/Home/Footer'
import HomeSection2 from '../../Components/Users/Home/HomeSection2'

function HomePage() {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <ServicesSection />
            <HomeSection2 />
            <Footer />
        </div>
    )
}

export default HomePage
