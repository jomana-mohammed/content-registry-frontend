"use client"

import Image from "next/image";
import heroImg from "../../../public/hero5.png";
import { useAuth } from "@/src/contexts/authContext";
import { useRouter } from "next/navigation";

const Home = () => {

    const {isAuthenticated} = useAuth();
    const router = useRouter();

    const handleGetStarted = () => {
        if(isAuthenticated){
            router.push('/upload');
        }else{
            router.push('/login');
        }
    }
    return(
       <section className="relative flex items-center min-h-screen overflow-hidden">
        
        {/* Image Side - Full width background */}
        <div className="absolute inset-0 w-full h-full">
            <Image
                src={heroImg}
                alt="Hero"
                fill
                className="object-cover"
                priority
            />
        </div>

        {/* Text Side with Half-Circle Rounded Right Edge */}
        <div className="relative z-10 flex items-center justify-center min-h-screen bg-gray/100 backdrop-blur-sm md:rounded-r-[50%] shadow-2xl transition-all duration-700 ease-in-out w-full md:w-1/2 md:hover:w-[65%] group">
            <div className="space-y-6 max-w-xl px-8 py-12 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white transition-transform duration-500 group-hover:scale-105">
                    Manage Your Content Easily
                </h1>
                <p className="text-lg md:text-xl text-white transition-opacity duration-500 group-hover:opacity-90">
                    Upload, organize, and access your files securely from anywhere.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <button className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg"
                        onClick={handleGetStarted}
                    >
                        Get Started
                    </button>
                    <button className="px-8 py-3 text-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-black transition-all duration-300 font-medium hover:scale-105 hover:shadow-md"
                        onClick={handleGetStarted}
                    >
                        Learn More
                    </button>
                </div>
            </div>
        </div>
        
       </section>
    )
}

export default Home;