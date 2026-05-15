import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    debugger;
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Feedback submitted successfully!");

        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        alert("Something went wrong");
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
          font-family:Arial, sans-serif;
        }

        .contact-page{
          min-height:100vh;
          background:#f4f7fb;
        }

        /* HERO */
        .contact-hero{
          height:60vh;
          background:
            linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),
            url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1974&auto=format&fit=crop');

          background-size:cover;
          background-position:center;

          display:flex;
          align-items:center;
          justify-content:center;
          text-align:center;
          padding:20px;
        }

        .contact-hero h1{
          color:white;
          font-size:60px;
          margin-bottom:20px;
        }

        .contact-hero p{
          color:#ddd;
          font-size:20px;
          max-width:700px;
          margin:auto;
          line-height:1.6;
        }

        /* CONTACT CONTAINER */
        .contact-container{
          max-width:1200px;
          margin:auto;
          padding:80px 20px;

          display:grid;
          grid-template-columns:1fr 1fr;
          gap:50px;
        }

        /* LEFT */
        .contact-info{
          background:white;
          padding:50px;
          border-radius:20px;
          box-shadow:0 5px 20px rgba(0,0,0,0.08);
        }

        .contact-info h2{
          font-size:40px;
          color:#1d4ed8;
          margin-bottom:20px;
        }

        .contact-info p{
          color:#555;
          font-size:18px;
          line-height:1.8;
          margin-bottom:20px;
        }

        .info-box{
          margin-top:30px;
        }

        .info-item{
          margin-bottom:20px;
        }

        .info-item h3{
          color:#1d4ed8;
          margin-bottom:8px;
        }

        /* RIGHT FORM */
        .contact-form{
          background:white;
          padding:50px;
          border-radius:20px;
          box-shadow:0 5px 20px rgba(0,0,0,0.08);
        }

        .contact-form h2{
          color:#1d4ed8;
          font-size:40px;
          margin-bottom:30px;
        }

        .input-group{
          margin-bottom:20px;
        }

        .input-group input,
        .input-group textarea{
          width:100%;
          padding:16px;
          border:1px solid #ccc;
          border-radius:10px;
          font-size:16px;
          outline:none;
        }

        .input-group textarea{
          resize:none;
          height:150px;
        }

        .submit-btn{
          width:100%;
          background:#1d4ed8;
          color:white;
          border:none;
          padding:16px;
          font-size:18px;
          border-radius:10px;
          cursor:pointer;
          transition:0.3s;
        }

        .submit-btn:hover{
          background:#143ea8;
        }

        /* RESPONSIVE */
        @media(max-width:900px){
          .contact-container{
            grid-template-columns:1fr;
          }

          .contact-hero h1{
            font-size:40px;
          }

          .contact-hero p{
            font-size:16px;
          }

          .contact-info h2,
          .contact-form h2{
            font-size:30px;
          }
        }
      `}</style>

      <div className="contact-page">
        {/* HERO */}
        <section className="contact-hero">
          <div>
            <h1>Contact Us</h1>

            <p>
              Have questions or need repair services? Contact FixBuddy anytime.
              We are here to help you.
            </p>
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact-container">
          {/* LEFT */}
          <div className="contact-info">
            <h2>Get In Touch</h2>

            <p>
              Reach out to us for home repair services, support, or feedback.
              Our team is available 24/7 for assistance.
            </p>

            <div className="info-box">
              <div className="info-item">
                <h3>Address</h3>
                <p>Ahmedabad, Gujarat, India</p>
              </div>

              <div className="info-item">
                <h3>Email</h3>
                <p>support@fixbuddy.com</p>
              </div>

              <div className="info-item">
                <h3>Phone</h3>
                <p>+91 9876543210</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="contact-form">
            <h2>Send Feedback</h2>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter your phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <textarea
                  name="message"
                  placeholder="Write your feedback..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                Submit Feedback
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default ContactUs;