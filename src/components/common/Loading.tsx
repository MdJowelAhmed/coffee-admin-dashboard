

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 h-72 w-full">
      
      <div className="relative flex items-center justify-center">
        
        {/* spinning dotted border */}
        <div className="absolute h-16 w-16 rounded-full border-2 border-dashed border-primary animate-spin"></div>

        {/* center image */}
        <div className="h-12 w-12 flex items-center justify-center ">
          <img
            src="/favicon.svg"
            alt="loading"
                width={40}
            height={40}
            className="object-contain"
          />
        </div>

      </div>

    </div>
  );
};

export default Loading;