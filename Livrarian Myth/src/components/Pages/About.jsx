import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import '../../styles/about.css'


const About = () => {
    
    return (
        <div className="content-content">
            <h1>About Us</h1>
            
            <p className="context"> 
                Welcome to Mythic Reads, your premier online destination for captivating 
                mythology and fictional stories from around the world. Our mission is to 
                bring the timeless tales of gods, heroes, and mythical creatures to life, 
                offering readers an immersive experience into the fascinating world of mythology.
            </p>

            <h3>Our Vision</h3>

            <p className="context">
                At Mythic Reads, we believe that myths and legends are more than just stories—they 
                are windows into the cultures, beliefs, and values of ancient civilizations. Our 
                vision is to create a rich tapestry of global mythologies, where every reader can 
                find inspiration, adventure, and a deeper understanding of the human experience 
                through these timeless narratives.
            </p>

            <h3>What We Offer</h3>

            <p className="context">
                <ul>
                    <li>- Extensive Library: Explore our vast collection of online books, featuring myths and legends from diverse cultures including Greek, Roman, Norse, Egyptian, and more.</li>
                    <li>- Curated Collections: Discover specially curated collections that highlight different themes, such as heroism, love, and the supernatural.</li>
                    <li>- Author Spotlights: Learn about the authors who bring these mythological tales to life, including classic writers and contemporary storytellers.</li>
                    <li>- Interactive Features: Engage with interactive elements that enhance your reading experience, including audio narrations, visual art, and community discussions.</li>
                </ul>           
            </p>

            <h3>Our Community</h3>

            <p className="context">
                Mythic Reads is more than just a library—it's a community of readers, writers, and 
                enthusiasts who share a passion for mythology. Join our forums to discuss your favorite 
                myths, share your interpretations, and connect with fellow mythology lovers from around the globe.
            </p>

            <h3>Our Team</h3>

            <p className="context">
                Our dedicated team of literary experts, historians, and mythology enthusiasts work 
                tirelessly to provide you with the best reading experience. We are committed to curating 
                high-quality content, ensuring that each story you read on Mythic Reads is both engaging and enlightening.
            </p>

            <h3>Get in Touch</h3>
            
            <p className="context">
                We love hearing from our readers! Whether you have a question, a suggestion, or just want 
                to share your favorite myth, feel free to contact us. Connect with us through our social 
                media channels or send us an email at livrarianmyth@gmail.com.
            </p>
        </div>
    )
}

export default About;