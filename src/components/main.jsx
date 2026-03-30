import React, { useState, useEffect } from "react";

const Home = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="hero border-1 pb-3">
        <div className="card bg-dark text-white border-0 mx-3">
          <img
            className="card-img img-fluid hero-img"
            src="https://res.cloudinary.com/dyxbvlzcl/image/upload/v1774849769/newimg_gydvif.jpg"
            alt="Card"
            style={{
              height: isMobile ? "32vh" : "65vh",
              objectFit: "cover",
            }}
          />
          <div className="card-img-overlay d-flex align-items-center">
            <div className="container ">
              <h5
                className="card-title fs-1 text fw-lighter"
                style={{
                  fontWeight: "900",
                  letterSpacing: "2px",
                  color: "#ffffff",
                  textShadow:
                    "0px 0px 5px #000, 2px 2px 10px #000, 4px 4px 20px #000",
                }}
              >
                New Season Arrivals
              </h5>
              <p
                className="card-text fs-5 "
                style={{
                  color: "#f5f5f5",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  textShadow: "2px 3px 10px rgba(0,0,0,0.9)",
                  maxWidth: "900px",
                  lineHeight: "1.3",
                }}
              >
                Step into the new season with our handcrafted jewellery
                collection, blending traditional craftsmanship with modern
                elegance
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;