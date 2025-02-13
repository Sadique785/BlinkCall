import React from "react";
import Header from "../components/Home/Header";
import Footer from "../components/Home/Footer";
import MainContent from "../components/Home/MainContent";

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <MainContent />
            <Footer />
        </div>
    );
};

export default Home;