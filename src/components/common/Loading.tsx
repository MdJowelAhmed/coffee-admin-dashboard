

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-96 w-full">
      
      <div className="relative flex items-center justify-center">
        
        {/* spinning dotted border */}
        <div className="absolute h-16 w-16 rounded-full border-2 border-dashed border-primary animate-spin"></div>

        {/* center image */}
        <div className="h-16 w-16 flex items-center justify-center ">
          <img
            src="/assets/pngtree-coffee.png"
            alt="loading"
                width={50}
            height={50}
            className="object-contain"
          />
        </div>

      </div>

    </div>
  );
};

export default Loading;