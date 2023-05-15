import {
  FaStar,
  FaShoppingCart,
  FaGift,
  FaTicketAlt,
  FaPercent,
  FaHeart,
} from "react-icons/fa";

const images = [
  { color: "bg-red-800", icon: <FaStar /> },
  { color: "bg-blue-800", icon: <FaShoppingCart /> },
  { color: "bg-green-800", icon: <FaGift /> },
  { color: "bg-yellow-800", icon: <FaTicketAlt /> },
  { color: "bg-pink-800", icon: <FaPercent /> },
  { color: "bg-purple-800", icon: <FaHeart /> },
];

const phrases = [
  "Sale only today!",
  "Buy more, pay less",
  "Free shipping",
  "Special deal for you",
  "Prices reduced by up to 50%",
  "Limited time offer",
];

export default function Offers() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mt-4 mb-4 px-4">
      {images.map((image, index) => (
        <div
          key={index}
          className={`rounded-md ${image.color} flex items-center transition-all justify-center py-10 cursor-pointer hover:bg-opacity-80 hover:scale-105`}>
          <div className="flex flex-col items-center justify-center text-white">
            {image.icon}
            <span className="text-xs md:text-sm">{phrases[index]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
