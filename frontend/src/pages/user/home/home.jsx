import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";

function Home() {
  const navigate = useNavigate();

  const images = [
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",

    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1887&auto=format&fit=crop",

    "https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2070&auto=format&fit=crop"
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slider = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(slider);
  }, []);

  const services = [
    {
      name: "AC Fitting",
      icon: "❄️",
      desc: "Professional AC installation & repair"
    },
    {
      name: "Home Cleaning",
      icon: "🧹",
      desc: "Complete home deep cleaning service"
    },
    {
      name: "Plumber",
      icon: "🚿",
      desc: "Fast plumbing solutions at your door"
    },
    {
      name: "Electrician",
      icon: "⚡",
      desc: "Safe electrical repair & installation"
    }
  ];

  const handleServiceRedirect = () => {
    navigate("/services");
  };

  return (
    <div className="home">

      {/* SLIDER */}

      <div className="slider">
        <img
          src={images[currentSlide]}
          alt="slider"
          className="slider-img"
        />

        <div className="overlay">
          <h1>Welcome to FixBuddy</h1>

          <p>
            Book trusted repair services instantly
          </p>

          <button onClick={handleServiceRedirect}>
            Book Service
          </button>
        </div>
      </div>

      {/* SERVICES */}

      <section className="services">

        <h2>Our Services</h2>

        <div className="service-grid">

          {services.map((service, index) => (
            <div key={index} className="card">

              <div className="card-top">
                <h1>{service.icon}</h1>

                <h3>{service.name}</h3>

                <p>{service.desc}</p>
              </div>

              <button
                className="service-btn"
                onClick={handleServiceRedirect}
              >
                Book Now
              </button>

            </div>
          ))}

        </div>
      </section>

    </div>
  );
}

export default Home;