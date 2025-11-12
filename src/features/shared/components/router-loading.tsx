export const RouterLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="w-3 h-3 bg-primary rounded-full animate-pulse"
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: '1s',
            }}
          />
        ))}
      </div>
    </div>
  );
};
