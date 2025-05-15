const MinimalFooter = () => {
  return (
    <footer className="bg-gray-900 py-6 border-t border-gray-800">
      <div className="container mx-auto px-4 text-center text-gray-400">
        &copy; {new Date().getFullYear()} Finfun.xyz. All rights reserved.
      </div>
    </footer>
  );
};

export default MinimalFooter;
