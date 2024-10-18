"use client";
import Image from "next/image";

const RightContainer = ({ src, alt }) => {
  return (
    <div className="hidden lg:block lg:w-1/3 w-full">
      <Image
        src={src}
        alt={alt}
        className="w-full object-cover rightImage"
        layout="responsive"
        width={600}
        height={400}
      />
    </div>
  );
};

export default RightContainer;
