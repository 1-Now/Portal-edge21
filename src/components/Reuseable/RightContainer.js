const RightContainer = ({ src, alt }) => {
  return (
    <div className="hidden lg:block lg:w-1/3 w-full">
      <img
        src={src}
        alt={alt}
        className="w-full object-cover rightImage"
        layout="responsive"
      />
    </div>
  );
};

export default RightContainer;
