import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import {
  MapPin,
  Camera,
  BadgeCheck,
  ShieldCheck,
  Users,
  MousePointerClick,
} from "lucide-react"; // Lucide Icons

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/home");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 bg-black shadow-md sticky top-0 z-10">
        <h1 className="text-3xl font-bold italic text-white">LostNFound</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-800 hover:text-white transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-800 hover:text-white transition"
          >
            Signup
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-10 py-20 gap-10 max-w-7xl mx-auto">
        <div className="max-w-xl space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Lost something? <br /> Found something?
          </h2>
          <p className="text-lg text-gray-300">
            Reuniting people with their belongings. Post, prove, return — together we build trust.
          </p>
          <button
            onClick={() => navigate("/createpost")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white text-lg transition"
          >
            Post Now
          </button>
        </div>
        <div className="w-full md:w-1/2">
          <img src="/brand.png" alt="Lost and Found" className="rounded-xl shadow-xl w-full" />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-900 py-16 px-6">
        <h3 className="text-3xl text-center font-bold mb-12">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
          <div className="p-6 bg-gray-800 rounded-lg shadow hover:scale-105 transition-transform">
            <Camera className="mx-auto text-blue-500 mb-4" size={32} />
            <h4 className="text-xl font-semibold mb-2">Post an Item</h4>
            <p className="text-gray-400">
              Upload photos, details, and location of the lost or found item.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow hover:scale-105 transition-transform">
            <BadgeCheck className="mx-auto text-green-400 mb-4" size={32} />
            <h4 className="text-xl font-semibold mb-2">Submit Proof</h4>
            <p className="text-gray-400">
              Submit information and visual evidence to claim or confirm ownership.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg shadow hover:scale-105 transition-transform">
            <Users className="mx-auto text-yellow-300 mb-4" size={32} />
            <h4 className="text-xl font-semibold mb-2">Reunite</h4>
            <p className="text-gray-400">
              The rightful owner is notified. Once verified, the item is returned.
            </p>
          </div>
        </div>
      </section>

      {/* Locate on Map Feature */}
      <section className="bg-gray-950 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <MapPin className="mx-auto text-red-500 mb-4" size={40} />
          <h3 className="text-3xl font-bold mb-4">Locate with Map</h3>
          <p className="text-gray-400 text-lg">
            Every post is geo-tagged. You can view and mark where your item was lost or found using an interactive map.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 bg-gray-900 text-center">
        <h3 className="text-3xl font-bold mb-6">Why Use LostNFound?</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <ShieldCheck className="mx-auto text-teal-400 mb-4" size={32} />
            <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
            <p className="text-gray-400">
              Only verified users can post or claim. Your information stays safe.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <Users className="mx-auto text-blue-400 mb-4" size={32} />
            <h4 className="text-xl font-semibold mb-2">Community Based</h4>
            <p className="text-gray-400">
              A platform built on trust and responsibility — help each other out.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <MousePointerClick className="mx-auto text-orange-400 mb-4" size={32} />
            <h4 className="text-xl font-semibold mb-2">Simple & Effective</h4>
            <p className="text-gray-400">
              Designed to be intuitive. Post, view, verify, and resolve — no hassle.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-black py-16 px-6 text-center">
        <h3 className="text-3xl font-bold mb-10">What Users Say</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-300">"Found my lost bag thanks to LostNFound. Totally recommend it!"</p>
            <h5 className="mt-4 text-blue-400 font-semibold">— Shalini V.</h5>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-300">"Returned someone's phone using this app. Smooth experience."</p>
            <h5 className="mt-4 text-blue-400 font-semibold">— Abhishek R.</h5>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-300">"Easy to use and the map feature is super helpful."</p>
            <h5 className="mt-4 text-blue-400 font-semibold">— Riya J.</h5>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-center">
        <h3 className="text-3xl font-bold text-white mb-4">Let’s bring things back where they belong.</h3>
        <p className="text-white mb-6 text-lg">Start your first post now and help make someone’s day.</p>
        <button
          onClick={() => navigate("/createpost")}
          className="bg-white text-blue-700 px-6 py-3 text-lg font-semibold rounded hover:bg-gray-100 transition"
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 py-6 border-t border-gray-700 bg-black">
        © {new Date().getFullYear()} LostNFound. Built with trust and community in mind.
      </footer>
    </div>
  );
}

export default LandingPage;
