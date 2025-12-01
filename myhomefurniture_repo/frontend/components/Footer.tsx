export default function Footer() {
    return (
        <footer className="bg-[#212121] text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-4 text-[#c7b299]">Decor Interior</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            We provide the best furniture for your home. Quality and elegance are our priorities.
                            Transform your living space with our premium collection.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4 uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-[#c7b299] transition">Home</a></li>
                            <li><a href="#" className="hover:text-[#c7b299] transition">About Us</a></li>
                            <li><a href="#" className="hover:text-[#c7b299] transition">Services</a></li>
                            <li><a href="#" className="hover:text-[#c7b299] transition">Gallery</a></li>
                            <li><a href="#" className="hover:text-[#c7b299] transition">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4 uppercase tracking-wider">Contact Us</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li className="flex items-start">
                                <span className="mr-2">📍</span>
                                123 Furniture Street, Design City, DC 12345
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">📞</span>
                                +1 234 567 8900
                            </li>
                            <li className="flex items-center">
                                <span className="mr-2">✉️</span>
                                info@myhomefurniture.in
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4 uppercase tracking-wider">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for updates</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="bg-[#333] text-white px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#c7b299]"
                            />
                            <button className="bg-[#c7b299] px-4 py-2 hover:bg-[#9e8a74] transition">
                                Go
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Decor Interior. All Rights Reserved | Design by <a href="https://w3layouts.com" className="text-[#c7b299] hover:underline">W3Layouts</a></p>
                </div>
            </div>
        </footer>
    );
}
