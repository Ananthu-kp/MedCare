import React from 'react';
import Psylogo from "../../../assets/images/Psylogo.png";
import Ped1 from "../../../assets/images/ped1.png";
import Skin from "../../../assets/images/skin.png";
import EmgMed from "../../../assets/images/emgMed.png";
import Teeth from "../../../assets/images/teeth.png";
import Ent from "../../../assets/images/ent.png";


function ServicesSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold text-center mb-12 text-[#159e8e]" id='services'>Services we provide</h3>
                <p className='text-1xl text-center mb-12'>The Best Quality Services For Your Family</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-lg">
                        <img src={EmgMed} alt="Emergency Services" className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-[#159e8e]">Emergency Services</h4>
                        <p className="text-gray-600 mt-2">Provide immediate care for acute illnesses and injuries. Includes emergency room physicians and trauma care specialists.</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-lg">
                        <img src={Skin} alt="Dermatology" className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-[#159e8e]">Dermatology</h4>
                        <p className="text-gray-600 mt-2">Provides care for skin, hair, and nail disorders, including acne, eczema, and psoriasis. It is a specialty with both medical and surgical aspects.</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-lg">
                        <img src={Teeth} alt="Orthodontics" className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-[#159e8e]">Orthodontics</h4>
                        <p className="text-gray-600 mt-2">Provides care for teeth, prevention of oral health issues. Specializes in correcting misaligned teeth and jaws, often with braces or clear aligners.</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-lg">
                        <img src={Ped1} alt="Pediatrics" className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-[#159e8e]">Pediatrics</h4>
                        <p className="text-gray-600 mt-2">Focuses on the medical care of infants, children, and adolescents. Includes pediatricians and specialists for various childhood conditions.</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-lg">
                        <img src={Psylogo} alt="Psychiatry" className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-[#159e8e]">Psychiatry</h4>
                        <p className="text-gray-600 mt-2">Provides care for mental health, specializes in mental health disorders, including depression, anxiety, and other psychological conditions.</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-lg">
                        <img src={Ent} alt="ENT" className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-[#159e8e]">ENT</h4>
                        <p className="text-gray-600 mt-2">Provides care for conditions related to the ear, nose, and throat, including hearing loss, sinusitis, and throat infections.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ServicesSection;
