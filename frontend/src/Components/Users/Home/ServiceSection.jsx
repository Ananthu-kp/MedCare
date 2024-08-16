import React from 'react';
import PsychiatryImage from "../../../assets/images/Psylogo.png"
import PediatricsImage from "../../../assets/images/ped1.png"
import DermatologyImage from "../../../assets/images/skin.png"
import EmergencyImage from "../../../assets/images/emgMed.png"
import OrthodonticsImage from "../../../assets/images/teeth.png"
import ENTImage from "../../../assets/images/ent.png"

function ServicesSection() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <h3 className="text-3xl font-bold text-center mb-12 text-[#159e8e]" id='services'>Services we provide</h3>
                <p className='text-1xl text-center mb-12'>The Best Quality Sevices For Your Family</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Each service card */}
                    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-lg">
                        <img src={EmergencyImage} alt="Service 1" className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-[#159e8e]">Emergency Services</h4>
                        <p className="text-gray-600 mt-2">provide immediate care for acute illnesses and injuries.
                            includes emergency room physicians and trauma care
                            specialists.</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-lg">
                        <img src={DermatologyImage} alt="Service 2" className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-[#159e8e]">Dermatology</h4>
                        <p className="text-gray-600 mt-2">provides care for skin, hair, and nail disorders, including
                            acne, eczema, and psoriasis. it is a speciality with both
                            medical and surgical aspects.</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-lg">
                        <img src={OrthodonticsImage} alt="Service 3" className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-[#159e8e]">Orthodontics</h4>
                        <p className="text-gray-600 mt-2">Provides care for teeth, prevention of oral health issues.
                            specializes in correcting misaligned teeth and jaws,
                            often with braces or clear aligners.</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-lg">
                        <img src={PediatricsImage} alt="Service 4" className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-[#159e8e]">Pediatrics</h4>
                        <p className="text-gray-600 mt-2">focuses on the medical care of infants, children, and
                            adolescents. includes pediatricians and specialists for
                            various childhood conditions.</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-lg">
                        <img src={PsychiatryImage} alt="Service 5" className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-[#159e8e]">Psychiatry</h4>
                        <p className="text-gray-600 mt-2">provide care for health, specializes in mental health
                            disorders, including depression, anxiety, and other
                            psychological conditions.</p>
                    </div>
                    <div className="text-center p-4 bg-gray-100 rounded-lg shadow-lg">
                        <img src={ENTImage} alt="Service 6" className="w-16 h-16 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-[#159e8e]">ENT</h4>
                        <p className="text-gray-600 mt-2">provides care deals with conditions related to the ear,
                            nose, and throat including hearing loss, sinusitis, and
                            throat infections.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ServicesSection;