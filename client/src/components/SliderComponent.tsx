import React, { useRef } from "react";
import Slider from "react-slick";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type SlideProps = {
  image: string;
  link: string;
  text: string;
};

const Slide = ({ image, link, text }: SlideProps) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer">
      <div
        className="h-96 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${image})` }}>
        <div className="absolute bottom-0 left-0 right-0 text-center bg-gray-800 bg-opacity-50 py-2">
          <p className="text-white text-lg font-bold">{text}</p>
        </div>
      </div>
    </a>
  );
};

const SliderComponent = () => {
  const sliderRef = useRef<Slider>(null);

  const previous = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const next = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <div className="mb-10 relative">
      <Slider
        ref={sliderRef}
        dots
        infinite
        speed={500}
        slidesToShow={1}
        slidesToScroll={1}>
        <div>
          <Slide
            image="https://images2.alphacoders.com/492/thumb-1920-49262.jpg"
            link="https://www.example.com"
            text="CLEARANCE SALE 50%"
          />
        </div>
        <div>
          <Slide
            image="https://wallpapercave.com/wp/aHQJxfX.jpg"
            link="https://www.example.com"
            text="SUMMER SALE 30%"
          />
        </div>
        <div>
          <Slide
            image="https://wallpaperset.com/w/full/b/9/4/438478.jpg"
            link="https://www.example.com"
            text="END OF SEASON SALE 60%"
          />
        </div>
      </Slider>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
        <FaArrowAltCircleLeft
          className="text-white text-4xl cursor-pointer hover:scale-110 transition-transform"
          onClick={previous}
        />
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
        <FaArrowAltCircleRight
          className="text-white text-4xl cursor-pointer hover:scale-110 transition-transform"
          onClick={next}
        />
      </div>
    </div>
  );
};

export default SliderComponent;
