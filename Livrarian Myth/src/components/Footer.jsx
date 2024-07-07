import React from 'react'
import '../styles/footer.css'

const Footer = () => {
    return (
        <footer className="footer">
        <div className="container-for-footer">
            <div className="row-links">
                <div className="footer-col">
                    <h4>company</h4>
                    <ul>
                        <li><a href="#">about us</a></li>
                        <li><a href="#">our services</a></li>
                        <li><a href="#">privacy policy</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>get help</h4>
                    <ul>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">How to read</a></li>
                        <li><a href="#">returns</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>online shop</h4>
                    <ul>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Book Covers</a></li>
                    </ul>
                </div>
                <div className="footer-col">
                    <h4>follow us</h4>
                    <div className="social-links">
                        <a href="#"><i className="bi bi-facebook"></i></a>
                        <a href="#"><i className="bi bi-twitter"></i></a>
                        <a href="#"><i className="bi bi-instagram"></i></a>
                        <a href="#"><i className="bi bi-linkedin"></i></a>
                    </div>
                </div>
            </div>
            <div className='foot-line d-flex  flex-column justify-content-center align-items-center mt-5 lh-1'>
                <p className='text-secondary'>Livrarian Myth</p>
                <p className='text-secondary'>2001-2024</p>
            </div>
        </div>
   </footer>
    )
}

export default Footer;