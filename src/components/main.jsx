import React from "react";

const Home = () => {
  return (
    <>
      <div className="hero border-1 pb-3">
        <div className="card bg-dark text-white border-0 mx-3">
          <img
            className="card-img img-fluid hero-img"
            src="https://res.cloudinary.com/dyxbvlzcl/image/upload/v1774849769/newimg_gydvif.jpg"
            alt="Card"
            style={{ height: "65vh", objectFit: "cover" }}
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
                className="card-text fs-5 d-none d-sm-block"
                style={{
                  color: "#f5f5f5",
                  fontWeight: "600",
                  letterSpacing: "1px",
                  textShadow: "2px 3px 10px rgba(0,0,0,0.9)",
                  maxWidth: "900px",
                  lineHeight: "1.6",
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
