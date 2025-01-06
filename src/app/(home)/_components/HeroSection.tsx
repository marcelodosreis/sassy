import Image from 'next/image';

export default function HeroSection() {
    return (
        <div className="py-28 max-w-7xl mx-auto px-12 sm:px-16 lg:px-28">
            <div className="flex flex-col lg:flex-row items-center lg:items-center">
                {/* Texto */}
                <div className="lg:w-2/3">
                    <h1 className="text-6xl font-extrabold text-gray-900">
                        Welcome to <br />Micro-SaaS Creator
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Empower your vision with tools to build Micro-SaaS solutions effortlessly.
                    </p>
                    <a href="/dashboard">
                        <button className="mt-6 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 w-64">
                            Get Started
                        </button>
                    </a>
                </div>

                {/* Imagem */}
                <div className="lg:ml-auto lg:w-1/3">
                    <Image
                        src="/home-img-1.svg"
                        alt="Micro-SaaS Illustration"
                        className="rounded-lg"
                        layout="intrinsic"
                        width={400}
                        height={0}
                    />
                </div>
            </div>
        </div>
    );
}
