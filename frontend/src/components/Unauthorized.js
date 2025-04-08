import React from 'react';

const Unauthorized = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold text-red-600">403 - Unauthorized</h1>
      <p className="mt-4 text-lg">You do not have permission to access this page.</p>
    </div>
  );
};

export default Unauthorized;
