import React from "react";
import {
  Monitor,
  Users,
  Award,
  Clock,
  CheckCircle,
  Laptop,
  HeadphonesIcon,
  ShieldCheck,
} from "lucide-react";

export function AboutUs() {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-blue-50 to-white py-20">
        <div className="container px-4 mx-auto">
          <h1 className="text-2xl md:text-2xl font-bold text-center mb-6">
            About Sala.lk
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Your trusted partner in IT solutions and computer hardware. We
            deliver cutting-edge technology solutions and expert consultancy
            services across Sri Lanka.
          </p>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-16 container px-4 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-black-600">10+</p>
            <p className="text-gray-600">Years Experience</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-black-600">5000+</p>
            <p className="text-gray-600">Happy Clients</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-black-600">1000+</p>
            <p className="text-gray-600">Projects Completed</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-black-600">24/7</p>
            <p className="text-gray-600">Support Available</p>
          </div>
        </div>
      </section>
      {/* Core Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 text-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <Award className="w-12 h-12 mx-auto mb-4 text-black-600" />
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                Committed to delivering the highest quality solutions and
                services.
              </p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <Users className="w-12 h-12 mx-auto mb-4 text-black-600" />
              <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
              <p className="text-gray-600">
                Your success is our priority - we're here to help you grow.
              </p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-black-600" />
              <h3 className="text-xl font-semibold mb-2">Reliability</h3>
              <p className="text-gray-600">
                Trustworthy solutions and dependable support you can count on.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <Monitor className="w-10 h-10 text-black-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">IT Consultancy</h3>
              <p className="text-gray-600">
                Expert guidance for your technology needs.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Laptop className="w-10 h-10 text-black-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Computer Sales</h3>
              <p className="text-gray-600">
                Quality hardware from trusted brands.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <HeadphonesIcon className="w-10 h-10 text-black-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Technical Support</h3>
              <p className="text-gray-600">
                24/7 assistance for all your IT issues.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <CheckCircle className="w-10 h-10 text-black-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Custom Solutions</h3>
              <p className="text-gray-600">
                Tailored technology solutions for your business.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Company History */}
      <section className="bg-gray-50 py-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start mb-8">
              <Clock className="w-8 h-8 text-black-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">2013</h3>
                <p className="text-gray-600">
                  Founded with a vision to provide quality IT solutions in Sri
                  Lanka.
                </p>
              </div>
            </div>
            <div className="flex items-start mb-8">
              <Clock className="w-8 h-8 text-black-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">2018</h3>
                <p className="text-gray-600">
                  Expanded our services to include comprehensive IT consultancy.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="w-8 h-8 text-black-600 mt-1 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold mb-2">2023</h3>
                <p className="text-gray-600">
                  Became one of Sri Lanka's leading IT solution providers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}



