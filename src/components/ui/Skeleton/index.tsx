const Skeleton = ({ className = '' }: { className?: string }) => {
  return (
    <div
      className={`bg-background-dark-100 h-4 w-full animate-pulse rounded-sm ${className}`}
    />
  );
};

export default Skeleton;
