import { Carousel } from "react-responsive-carousel";
import banner1 from "../assets/banner 1.jpg";
import banner2 from "../assets/banner 2.jpg";
import banner3 from "../assets/banner 3.jpg";
import banner4 from "../assets/banner 4.jpg";
import banner5 from "../assets/banner 5.jpg";
import banner6 from "../assets/banner 6.jpg";

export default function Hero() {
  return (
    <div>
      <Carousel className="text-center" autoPlay={true}>
        <div>
          <img src={banner1} alt="" />
        </div>
        <div>
          <img src={banner2} alt="" />
        </div>
        <div>
          <img src={banner3} alt="" />
        </div>
        <div>
          <img src={banner4} alt="" />
        </div>
        <div>
          <img src={banner5} alt="" />
        </div>
        <div>
          <img src={banner6} alt="" />
        </div>
      </Carousel>
    </div>
  );
}
