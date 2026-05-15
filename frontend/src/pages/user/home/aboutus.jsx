import React from "react";

const AboutUs = () => {
  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family: Arial, sans-serif;
        }

        .about-page{
          background:#f4f7fb;
          min-height:100vh;
        }

        /* HERO */
        .hero{
          height:70vh;
          background:
            linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)),
            url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop');
          background-size:cover;
          background-position:center;
          display:flex;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding:20px;
        }

        .hero-content h1{
          color:white;
          font-size:60px;
          margin-bottom:20px;
        }

        .hero-content p{
          color:#ddd;
          font-size:20px;
          max-width:700px;
          line-height:1.6;
          margin:auto;
        }

        /* ABOUT SECTION */
        .about-container{
          max-width:1200px;
          margin:auto;
          padding:80px 20px;
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:50px;
          align-items:center;
        }

        .about-image img{
          width:100%;
          height:450px;
          object-fit:cover;
          border-radius:20px;
          box-shadow:0 10px 30px rgba(0,0,0,0.2);
        }

        .about-content h2{
          font-size:45px;
          color:#1d4ed8;
          margin-bottom:20px;
        }

        .about-content p{
          color:#555;
          font-size:18px;
          line-height:1.8;
          margin-bottom:20px;
        }

        .about-btn{
          background:#1d4ed8;
          color:white;
          border:none;
          padding:15px 30px;
          font-size:16px;
          border-radius:10px;
          cursor:pointer;
          transition:0.3s;
        }

        .about-btn:hover{
          background:#143ea8;
        }

        /* FEATURES */
        .features{
          max-width:1200px;
          margin:auto;
          padding:20px;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:25px;
        }

        .feature-card{
          background:white;
          padding:35px;
          border-radius:20px;
          text-align:center;
          box-shadow:0 5px 20px rgba(0,0,0,0.08);
          transition:0.3s;
        }

        .feature-card:hover{
          transform:translateY(-10px);
        }

        .feature-card h3{
          color:#1d4ed8;
          margin-bottom:15px;
          font-size:24px;
        }

        .feature-card p{
          color:#666;
          line-height:1.6;
        }

        /* STATS */
        .stats{
          margin-top:80px;
          background:#1d4ed8;
          padding:70px 20px;
        }

        .stats-container{
          max-width:1200px;
          margin:auto;
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:30px;
          text-align:center;
        }

        .stat-box{
          color:white;
        }

        .stat-box h2{
          font-size:55px;
          margin-bottom:10px;
        }

        .stat-box p{
          font-size:20px;
        }

        /* RESPONSIVE */
        @media(max-width:900px){
          .about-container{
            grid-template-columns:1fr;
          }

          .features{
            grid-template-columns:1fr;
          }

          .stats-container{
            grid-template-columns:1fr;
          }

          .hero-content h1{
            font-size:40px;
          }

          .hero-content p{
            font-size:16px;
          }

          .about-content h2{
            font-size:35px;
          }
        }
      `}</style>

      <div className="about-page">
        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <h1>About FixBuddy</h1>

            <p>
              Trusted home repair services with professional technicians,
              affordable pricing, and quick support anytime you need help.
            </p>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-container">
          <div className="about-image">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1974&auto=format&fit=crop"
              alt="team"
            />
          </div>

          <div className="about-content">
            <h2>Who We Are</h2>

            <p>
              FixBuddy connects customers with experienced repair professionals
              for plumbing, electrical work, appliance repairs, and home
              maintenance services.
            </p>

            <p>
              Our mission is to make repair services simple, transparent, and
              reliable for every household.
            </p>

            <button className="about-btn">Learn More</button>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features">
          <div className="feature-card">
            <h3>Expert Technicians</h3>

            <p>
              Skilled and verified professionals for every repair service.
            </p>
          </div>

          <div className="feature-card">
            <h3>Fast Service</h3>

            <p>
              Quick booking and rapid response for urgent repair needs.
            </p>
          </div>

          <div className="feature-card">
            <h3>Affordable Pricing</h3>

            <p>
              Transparent pricing with no hidden charges or extra costs.
            </p>
          </div>
        </section>

        {/* STATS */}
        <section className="stats">
          <div className="stats-container">
            <div className="stat-box">
              <h2>10K+</h2>
              <p>Happy Customers</p>
            </div>

            <div className="stat-box">
              <h2>500+</h2>
              <p>Expert Technicians</p>
            </div>

            <div className="stat-box">
              <h2>24/7</h2>
              <p>Customer Support</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;