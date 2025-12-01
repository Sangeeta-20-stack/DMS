export default function Hero() {
  return (
    <div className="w-full h-[90vh] bg-[#0A0A0A] text-white flex items-center">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 p-4">

        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-extrabold leading-tight">
            Delivery  
            <span className="text-yellow-400"> Management</span>  
            System
          </h1>

          <p className="mt-4 text-lg text-gray-300">
            A real-time order tracking platform for Buyers, Sellers, and Admins.  
            Manage, track, and streamline delivery operations efficiently.
          </p>

          <button className="mt-6 px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-500 w-fit">
            Get Started
          </button>
        </div>

        {/* Right Image (Using Direct Link) */}
        <div className="flex items-center justify-center">
          <img
            src="https://img.freepik.com/free-vector/customer-using-mobile-app-tracking-order-delivery_74855-5229.jpg"
            alt="Delivery Illustration"
            className="w-[350px] h-[350px] object-contain rounded-xl shadow-2xl"
          />
        </div>

      </div>
    </div>
  );
}
