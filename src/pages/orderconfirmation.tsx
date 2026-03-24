import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react'; // Assuming you use lucide-react for icons

const OrderConfirmation: React.FC = () => {
  const navigate = useNavigate();
  
  // Generating a random order ID for the "Flipkart" feel
  const orderId = Math.floor(Math.random() * 1000000000);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for shopping with us. Your order has been recorded and is being processed.
        </p>

        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <p className="text-sm text-gray-500 uppercase font-semibold">Order ID</p>
          <p className="text-lg font-mono font-bold text-blue-700">#OD{orderId}</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-[#fb641b] text-white font-medium py-2 rounded-sm hover:bg-[#f4511e] transition-colors"
          >
            Continue Shopping
          </button>
          
          <button 
            onClick={() => navigate('/orders')}
            className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-2 rounded-sm hover:bg-gray-50 transition-colors"
          >
            Track Order
          </button>
        </div>
      </div>
      
      <p className="mt-8 text-gray-500 text-sm">
        A confirmation email has been sent to your registered address.
      </p>
    </div>
  );
};

export default OrderConfirmation;