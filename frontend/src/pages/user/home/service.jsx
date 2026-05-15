import React, { useEffect, useState } from "react";

const Services = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [requests, setRequests] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    service: "",
    date: "",
    time: "",
    description: "",
  });

  // FETCH USER REQUESTS

  const fetchRequests = async () => {
    try {
      const email = user?.email?.toLowerCase();

      if (!email) return;

      const response = await fetch(
        `http://localhost:5000/api/services/${encodeURIComponent(email)}`
      );

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setRequests(data.data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.log(error);

      setRequests([]);
    }
  };

  // AUTO FILL USER DATA

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }

    fetchRequests();
  }, []);

  // HANDLE CHANGE

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // BOOK SERVICE DIRECTLY

  const handleQuickBook = (serviceName) => {
    setFormData((prev) => ({
      ...prev,
      service: serviceName,
    }));

    window.scrollTo({
      top: 700,
      behavior: "smooth",
    });
  };

  // SUBMIT FORM

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/services", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...formData,
          email: formData.email?.toLowerCase(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Service Request Submitted Successfully");

        fetchRequests();

        setFormData((prev) => ({
          ...prev,
          address: "",
          service: "",
          date: "",
          time: "",
          description: "",
        }));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);

      alert("Server Error");
    }
  };

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Arial,sans-serif;
        }

        .service-page{
          background:#f4f7fb;
          min-height:100vh;
        }

        /* HERO */

        .service-hero{
          height:60vh;

          background:
            linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
            url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop');

          background-size:cover;
          background-position:center;

          display:flex;
          align-items:center;
          justify-content:center;

          text-align:center;

          padding:20px;
        }

        .service-hero h1{
          color:white;
          font-size:60px;
          margin-bottom:20px;
        }

        .service-hero p{
          color:#ddd;
          font-size:20px;
          max-width:700px;
          line-height:1.6;
        }

        /* CONTAINER */

        .services-container{
          max-width:1200px;
          margin:auto;
          padding:80px 20px;
        }

        /* SERVICE GRID */

        .services-grid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:25px;
          margin-bottom:70px;
        }

        .service-card{
          background:white;

          padding:35px 25px;

          border-radius:20px;

          text-align:center;

          box-shadow:0 5px 20px rgba(0,0,0,0.08);

          transition:0.3s;

          display:flex;
          flex-direction:column;
          justify-content:space-between;

          min-height:340px;
        }

        .service-card:hover{
          transform:translateY(-10px);
        }

        .service-icon{
          font-size:55px;
          margin-bottom:15px;
        }

        .service-card h3{
          color:#1d4ed8;
          font-size:24px;
          margin-bottom:15px;
        }

        .service-card p{
          color:#666;
          line-height:1.7;

          flex-grow:1;

          display:flex;
          align-items:center;
          justify-content:center;

          margin-bottom:25px;
        }

        .service-btn{
          background:#1d4ed8;

          color:white;

          border:none;

          padding:14px 20px;

          border-radius:10px;

          cursor:pointer;

          transition:0.3s;

          font-size:16px;

          font-weight:bold;
        }

        .service-btn:hover{
          background:#143ea8;
        }

        /* FORM */

        .service-form{
          background:white;
          padding:50px;
          border-radius:20px;
          box-shadow:0 5px 20px rgba(0,0,0,0.08);
        }

        .service-form h2{
          font-size:40px;
          color:#1d4ed8;
          margin-bottom:30px;
          text-align:center;
        }

        .form-grid{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:20px;
        }

        .input-group{
          margin-bottom:20px;
        }

        .input-group input,
        .input-group select,
        .input-group textarea{
          width:100%;
          padding:16px;
          border:1px solid #ccc;
          border-radius:10px;
          font-size:16px;
          outline:none;
        }

        .input-group textarea{
          height:150px;
          resize:none;
        }

        .submit-btn{
          width:100%;
          background:#1d4ed8;
          color:white;
          border:none;
          padding:18px;
          border-radius:10px;
          font-size:18px;
          cursor:pointer;
          transition:0.3s;
        }

        .submit-btn:hover{
          background:#143ea8;
        }

        /* REQUESTS */

        .request-section{
          margin-top:70px;
        }

        .request-title{
          text-align:center;
          font-size:40px;
          color:#1d4ed8;
          margin-bottom:40px;
        }

        .request-grid{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:25px;
        }

        .request-card{
          background:white;
          padding:30px;
          border-radius:20px;
          box-shadow:0 5px 20px rgba(0,0,0,0.08);
        }

        .request-card h3{
          color:#1d4ed8;
          margin-bottom:15px;
        }

        .request-card p{
          margin-bottom:10px;
          color:#555;
        }

        .approved{
          color:green;
          font-weight:bold;
          margin-left:10px;
        }

        .pending{
          color:orange;
          font-weight:bold;
          margin-left:10px;
        }

        .rejected{
          color:red;
          font-weight:bold;
          margin-left:10px;
        }

        @media(max-width:900px){

          .services-grid{
            grid-template-columns:1fr;
          }

          .form-grid{
            grid-template-columns:1fr;
          }

          .request-grid{
            grid-template-columns:1fr;
          }

          .service-hero h1{
            font-size:40px;
          }

          .service-form h2,
          .request-title{
            font-size:30px;
          }
        }
      `}</style>

      <div className="service-page">

        {/* HERO */}

        <section className="service-hero">
          <div>
            <h1>Our Services</h1>

            <p>
              Book trusted home repair professionals quickly and easily with
              FixBuddy.
            </p>
          </div>
        </section>

        <section className="services-container">

          {/* SERVICE CARDS */}

          <div className="services-grid">

            <div className="service-card">
              <div className="service-icon">❄️</div>

              <h3>AC Fitting</h3>

              <p>
                Professional AC installation and maintenance services.
              </p>

              <button
                className="service-btn"
                onClick={() => handleQuickBook("AC Fitting")}
              >
                Book Now
              </button>
            </div>

            <div className="service-card">
              <div className="service-icon">🧹</div>

              <h3>Home Cleaning</h3>

              <p>
                Complete house cleaning with expert staff.
              </p>

              <button
                className="service-btn"
                onClick={() => handleQuickBook("Home Cleaning")}
              >
                Book Now
              </button>
            </div>

            <div className="service-card">
              <div className="service-icon">🚰</div>

              <h3>Plumber</h3>

              <p>
                Quick plumbing solutions for all household problems.
              </p>

              <button
                className="service-btn"
                onClick={() => handleQuickBook("Plumber")}
              >
                Book Now
              </button>
            </div>

            <div className="service-card">
              <div className="service-icon">💡</div>

              <h3>Electrician</h3>

              <p>
                Safe and reliable electrical repair services.
              </p>

              <button
                className="service-btn"
                onClick={() => handleQuickBook("Electrician")}
              >
                Book Now
              </button>
            </div>

          </div>

          {/* FORM */}

          <div className="service-form">

            <h2>Book Service</h2>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="input-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select Service
                    </option>

                    <option value="AC Fitting">
                      AC Fitting
                    </option>

                    <option value="Home Cleaning">
                      Home Cleaning
                    </option>

                    <option value="Plumber">
                      Plumber
                    </option>

                    <option value="Electrician">
                      Electrician
                    </option>
                  </select>
                </div>

                <div className="input-group">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>

              </div>

              <div className="input-group">
                <input
                  type="text"
                  name="address"
                  placeholder="Your Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <textarea
                  name="description"
                  placeholder="Describe your problem..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                Submit Request
              </button>

            </form>
          </div>

          {/* REQUEST HISTORY */}

          <div className="request-section">

            <h2 className="request-title">
              Your Service Requests
            </h2>

            <div className="request-grid">

              {requests.length > 0 ? (
                requests.map((item, index) => (
                  <div className="request-card" key={index}>

                    <h3>{item.service}</h3>

                    <p>
                      <strong>Date:</strong> {item.date}
                    </p>

                    <p>
                      <strong>Time:</strong> {item.time}
                    </p>

                    <p>
                      <strong>Address:</strong> {item.address}
                    </p>

                    <p>
                      <strong>Status:</strong>

                      <span
                        className={
                          item.status === "Approved"
                            ? "approved"
                            : item.status === "Rejected"
                            ? "rejected"
                            : "pending"
                        }
                      >
                        {item.status}
                      </span>
                    </p>

                  </div>
                ))
              ) : (
                <h3>No Requests Found</h3>
              )}

            </div>
          </div>

        </section>
      </div>
    </>
  );
};

export default Services;