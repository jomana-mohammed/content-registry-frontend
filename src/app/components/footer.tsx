import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Send } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="inline-block text-2xl font-bold text-white mb-6">
                            Content<span className="text-indigo-500">Registry</span>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
                            Organize, manage, and share your digital assets with ease. The ultimate platform for content creators and teams.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:pl-12">
                        <h3 className="text-white font-semibold text-lg mb-6">Stay Updated</h3>
                        <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and features.</p>
                        <form className="flex flex-col gap-3">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    className="w-full bg-gray-800 border-none rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                            <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5">
                                Subscribe <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Content Registry. All rights reserved.
                    </p>
                    
                </div>
            </div>
        </footer>
    )
}