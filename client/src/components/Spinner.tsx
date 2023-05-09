import React from "react";
import { FadeLoader } from "react-spinners";

const Spinner = () => {
  return (
    <div className="bg-black fixed h-screen w-screen z-[9999] overflow-hidden flex opacity-60 justify-center items-center transition-all">
      <FadeLoader
        color="#fff"
        height={15}
        margin={2}
        radius={15}
        width={5}
      />
    </div>
  );
};

export default Spinner;
