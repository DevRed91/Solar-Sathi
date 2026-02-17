type AnimatingDotsProps = {
  color: string;
};

const AnimatingDots = ({ color }: AnimatingDotsProps) => {
  const delays = ['0s', '0.3s', '0.6s'];

  return (
    <div className="flex space-x-3">
      {delays.map((delay, idx) => (
        <div
          key={idx}
          className={`animate-pulse-scale h-3.5 w-3.5 rounded-full ${color}`}
          style={{ animationDelay: delay }}
        />
      ))}
    </div>
  );
};

export default AnimatingDots;
