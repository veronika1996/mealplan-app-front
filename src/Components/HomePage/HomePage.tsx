import React from 'react';
import { useNavigate } from 'react-router-dom';
import './homePage.css';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <div className="home-form">
                <h1 className="app-title"> 🌿Plan&amp;Prep</h1>

                <p className="motivational-text">
             <span>Kreirajte sopstvene planove, pratite dnevni unos kalorija i koristite svoju bazu recepata i sastojaka kako biste uvek bili korak bliže svojim ciljevima.</span>   <br></br>
             <span>Sve na jednom mestu – jednostavno, pregledno i prilagođeno Vašim potrebama.     </span> </p>           

                <h2 className="features-title"> Ova aplikacija Vam nudi: </h2>
                <ul className="features-list">
                    <li>🌿 Automatsko izračunavanje preporučenog dnevnog unosa kalorija prilikom registracije, prilagođeno Vašim ciljevima</li>
                    <li>🌿 Kreiranje i uređivanje lične baze recepata i sastojaka potrebnih za te recepte</li>
                    <li>🌿 Pravljenje planova ishrane koristeći bazu recepata</li>
                    <li>🌿 Bolju organizaciju Vaših obroka i poređenje isplaniranog unosa sa dnevnim ciljem</li>
                </ul>
                <p className="highlight">Da li ste spremni da preuzmete kontrolu nad svojom ishranom?</p>                

                <div className="button-div">
                    <button onClick={() => navigate('/register')}>Registrujte se</button>
                    <p>
                        Već ste korisnik? <span className="login-link" onClick={() => navigate('/login')}>Prijavite se</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
