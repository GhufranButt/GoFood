import React from "react";

export default function Carousel() {
  return (
    <div
      id="carouselExampleFade"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
      style={{ objectFit: "contain !important" }}
    >
      <div className="carousel-inner" id="carousel">
        <div className="carousel-caption" style={{ zIndex: "10" }}>
          <form className="d-flex">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              className="btn btn-outline-dark text-white bg-dark"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>

        <div className="carousel-item active">
          <img
            src="https://images.pexels.com/photos/1556688/pexels-photo-1556688.jpeg?w=1920&h=1080&dpr=2"
            // style={{ filter: "brightness(5)" }}
            className="d-block w-100"
            alt="..."
            style={{
              maxHeight: "700px",
              maxWidth: "2000px",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="carousel-item">
          <img
            src="https://images.pexels.com/photos/27588092/pexels-photo-27588092/free-photo-of-a-black-dish-with-meat-and-vegetables-on-it.jpeg?w=1920&h=1080&dpr=2"
            // style={{ filter: "brightness(100)" }}
            className="d-block w-100"
            alt="..."
            style={{
              maxHeight: "700px",
              maxWidth: "2000px",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="carousel-item">
          <img
            src="https://images.pexels.com/photos/5903162/pexels-photo-5903162.jpeg?w=1920&h=1080&dpr=2"
            // style={{ filter: "brightness(5)" }}
            className="d-block w-100"
            alt="..."
            style={{
              maxHeight: "700px",
              maxWidth: "2000px",
              objectFit: "cover",
            }}
          />
        </div>
        <div className="carousel-item">
          <img
            src="https://images.pexels.com/photos/17481113/pexels-photo-17481113/free-photo-of-raw-slices-of-meal-on-cutting-bard.jpeg?w=1920&h=1080&dpr=2
"
            // style={{ filter: "brightness(5)" }}
            className="d-block w-100"
            alt="..."
            style={{
              maxHeight: "700px",
              maxWidth: "2000px",
              objectFit: "cover",
            }}
          />
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
