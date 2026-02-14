import Link from "next/link";
import Image from "next/image";

export default function Location() {
    return (

        <section className="bg-white py-[70px]">
            <div className="container">
                <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[115px]">
                    <div>
                        <Image
                            src="/images/contact_img_1.png"
                            alt="cfff"
                            width={570}
                            height={297}
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="">
                            <p className="text-[#091B25] font-semibold text-[14px]">Location 1</p>
                            <h3 className="text-[#181D27] font-semibold text-[24px]">Abuja Trading Floor</h3>
                            <p className="text-[#535862] text-[16px] font-normal"><span className="inline-flex items-center font-bold gap-[3px]"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.0655 14.4816L13.9719 11.2H12.7719L13.4383 14.4H1.7055L2.3719 11.2H1.1719L0.077503 14.4816C-0.200097 15.3168 0.291903 16 1.1719 16H13.9719C14.8519 16 15.3439 15.3168 15.0655 14.4816ZM11.5719 4C11.5719 2.93913 11.1505 1.92172 10.4003 1.17157C9.65018 0.421427 8.63277 0 7.5719 0C6.51104 0 5.49362 0.421427 4.74348 1.17157C3.99333 1.92172 3.5719 2.93913 3.5719 4C3.5719 7.82 7.5719 12 7.5719 12C7.5719 12 11.5719 7.82 11.5719 4ZM5.4119 4.048C5.41212 3.47527 5.63978 2.92607 6.04484 2.52117C6.44989 2.11626 6.99917 1.8888 7.5719 1.8888C8.14466 1.8888 8.69397 2.11633 9.09897 2.52133C9.50397 2.92634 9.7315 3.47564 9.7315 4.0484C9.7315 4.62116 9.50397 5.17046 9.09897 5.57547C8.69397 5.98047 8.14466 6.208 7.5719 6.208C6.99904 6.208 6.44963 5.98043 6.04455 5.57535C5.63947 5.17027 5.4119 4.62087 5.4119 4.048Z" fill="#535862" />
                            </svg>
                                Location: </span> Bravado Plaza Sapele crecent Garki 2 Abuja.</p>
                            <div className="grid pt-[20px] gap-[20px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                <div className="flex items-start gap-[5px]">
                                    <div className="pt-[5px]">
                                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.75 0.75C4.75 0.334375 4.41563 0 4 0C3.58437 0 3.25 0.334375 3.25 0.75V2H2C0.896875 2 0 2.89687 0 4V14C0 15.1031 0.896875 16 2 16H12C13.1031 16 14 15.1031 14 14V4C14 2.89687 13.1031 2 12 2H10.75V0.75C10.75 0.334375 10.4156 0 10 0C9.58438 0 9.25 0.334375 9.25 0.75V2H4.75V0.75ZM1.5 6H4V7.75H1.5V6ZM1.5 9.25H4V11.25H1.5V9.25ZM5.5 9.25H8.5V11.25H5.5V9.25ZM10 9.25H12.5V11.25H10V9.25ZM12.5 7.75H10V6H12.5V7.75ZM12.5 12.75V14C12.5 14.275 12.275 14.5 12 14.5H10V12.75H12.5ZM8.5 12.75V14.5H5.5V12.75H8.5ZM4 12.75V14.5H2C1.725 14.5 1.5 14.275 1.5 14V12.75H4ZM8.5 7.75H5.5V6H8.5V7.75Z" fill="#535862" />
                                        </svg>
                                    </div>
                                    <div className="max-w-[204px]">
                                        <p className="text-[#535862] text-[16px] font-normal"><span className="inline-block font-bold">Academy Sessions: </span> <span className="block"> Monday - Friday</span></p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-[5px]">
                                    <div className="pt-[5px]">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_129_4596)">
                                                <path d="M8 4H7V9H11V8H8V4Z" fill="#535862" />
                                                <path d="M16 7V3L14.9 4.1C13.6 1.6 11 0 8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C10.4 16 12.6 14.9 14 13.2L12.5 11.9C11.4 13.2 9.8 14 8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C10.4 2 12.5 3.5 13.5 5.5L12 7H16Z" fill="#535862" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_129_4596">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    </div>
                                    <div className="max-w-[204px]">
                                        <p className="text-[#535862] text-[16px] font-normal"><span className="inline-block font-bold">Opening Time: </span> <span className="block"> 10am prompt</span></p>
                                    </div>
                                </div>

                               <div className="flex items-start gap-[5px]">
                                    <div className="pt-[5px]">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_129_4596)">
                                                <path d="M8 4H7V9H11V8H8V4Z" fill="#535862" />
                                                <path d="M16 7V3L14.9 4.1C13.6 1.6 11 0 8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C10.4 16 12.6 14.9 14 13.2L12.5 11.9C11.4 13.2 9.8 14 8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C10.4 2 12.5 3.5 13.5 5.5L12 7H16Z" fill="#535862" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_129_4596">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    </div>
                                    <div className="max-w-[204px]">
                                        <p className="text-[#535862] text-[16px] font-normal"><span className="inline-block font-bold">Opening Time: </span> <span className="block"> 9am prompt</span></p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-[5px]">
                                    <div className="pt-[5px]">
                                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.75 0.75C4.75 0.334375 4.41563 0 4 0C3.58437 0 3.25 0.334375 3.25 0.75V2H2C0.896875 2 0 2.89687 0 4V14C0 15.1031 0.896875 16 2 16H12C13.1031 16 14 15.1031 14 14V4C14 2.89687 13.1031 2 12 2H10.75V0.75C10.75 0.334375 10.4156 0 10 0C9.58438 0 9.25 0.334375 9.25 0.75V2H4.75V0.75ZM1.5 6H4V7.75H1.5V6ZM1.5 9.25H4V11.25H1.5V9.25ZM5.5 9.25H8.5V11.25H5.5V9.25ZM10 9.25H12.5V11.25H10V9.25ZM12.5 7.75H10V6H12.5V7.75ZM12.5 12.75V14C12.5 14.275 12.275 14.5 12 14.5H10V12.75H12.5ZM8.5 12.75V14.5H5.5V12.75H8.5ZM4 12.75V14.5H2C1.725 14.5 1.5 14.275 1.5 14V12.75H4ZM8.5 7.75H5.5V6H8.5V7.75Z" fill="#535862" />
                                        </svg>
                                    </div>
                                    <div className="max-w-[204px]">
                                        <p className="text-[#535862] text-[16px] font-normal"><span className="inline-block font-bold">Contact:  </span> +2345678909</p>
                                    </div>
                                </div>

                                 <div className="flex items-start gap-[5px]">
                                    <div className="pt-[5px]">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_129_4596)">
                                                <path d="M8 4H7V9H11V8H8V4Z" fill="#535862" />
                                                <path d="M16 7V3L14.9 4.1C13.6 1.6 11 0 8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C10.4 16 12.6 14.9 14 13.2L12.5 11.9C11.4 13.2 9.8 14 8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C10.4 2 12.5 3.5 13.5 5.5L12 7H16Z" fill="#535862" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_129_4596">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    </div>
                                    <div className="max-w-[204px]">
                                        <p className="text-[#535862] text-[16px] font-normal"><span className="inline-block font-bold">Email Address:  </span> <span className="block"> Falconsforexacademy@gmail.com</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>



                 <div className="flex flex-col lg:flex-row gap-[40px] lg:gap-[115px] pt-[50px] lg:pt-[100px]">
                    <div>
                        <Image
                            src="/images/contact_img_2.png"
                            alt="cfff"
                            width={570}
                            height={297}
                        />
                    </div>
                    <div className="flex items-center">
                        <div className="">
                            <p className="text-[#091B25] font-semibold text-[14px]">Location 2</p>
                            <h3 className="text-[#181D27] font-semibold text-[24px]">Kano Trading Floor</h3>
                            <p className="text-[#535862] text-[16px] font-normal"><span className="inline-flex items-center font-bold gap-[3px]"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.0655 14.4816L13.9719 11.2H12.7719L13.4383 14.4H1.7055L2.3719 11.2H1.1719L0.077503 14.4816C-0.200097 15.3168 0.291903 16 1.1719 16H13.9719C14.8519 16 15.3439 15.3168 15.0655 14.4816ZM11.5719 4C11.5719 2.93913 11.1505 1.92172 10.4003 1.17157C9.65018 0.421427 8.63277 0 7.5719 0C6.51104 0 5.49362 0.421427 4.74348 1.17157C3.99333 1.92172 3.5719 2.93913 3.5719 4C3.5719 7.82 7.5719 12 7.5719 12C7.5719 12 11.5719 7.82 11.5719 4ZM5.4119 4.048C5.41212 3.47527 5.63978 2.92607 6.04484 2.52117C6.44989 2.11626 6.99917 1.8888 7.5719 1.8888C8.14466 1.8888 8.69397 2.11633 9.09897 2.52133C9.50397 2.92634 9.7315 3.47564 9.7315 4.0484C9.7315 4.62116 9.50397 5.17046 9.09897 5.57547C8.69397 5.98047 8.14466 6.208 7.5719 6.208C6.99904 6.208 6.44963 5.98043 6.04455 5.57535C5.63947 5.17027 5.4119 4.62087 5.4119 4.048Z" fill="#535862" />
                            </svg>
                                Location: </span> Gidan Buhari Zoo Road Kano State.</p>
                            <div className="grid pt-[20px] gap-[20px] grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                                <div className="flex items-start gap-[5px]">
                                    <div className="pt-[5px]">
                                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.75 0.75C4.75 0.334375 4.41563 0 4 0C3.58437 0 3.25 0.334375 3.25 0.75V2H2C0.896875 2 0 2.89687 0 4V14C0 15.1031 0.896875 16 2 16H12C13.1031 16 14 15.1031 14 14V4C14 2.89687 13.1031 2 12 2H10.75V0.75C10.75 0.334375 10.4156 0 10 0C9.58438 0 9.25 0.334375 9.25 0.75V2H4.75V0.75ZM1.5 6H4V7.75H1.5V6ZM1.5 9.25H4V11.25H1.5V9.25ZM5.5 9.25H8.5V11.25H5.5V9.25ZM10 9.25H12.5V11.25H10V9.25ZM12.5 7.75H10V6H12.5V7.75ZM12.5 12.75V14C12.5 14.275 12.275 14.5 12 14.5H10V12.75H12.5ZM8.5 12.75V14.5H5.5V12.75H8.5ZM4 12.75V14.5H2C1.725 14.5 1.5 14.275 1.5 14V12.75H4ZM8.5 7.75H5.5V6H8.5V7.75Z" fill="#535862" />
                                        </svg>
                                    </div>
                                    <div className="max-w-[204px]">
                                        <p className="text-[#535862] text-[16px] font-normal"><span className="inline-block font-bold">Academy Sessions: </span> <span className="block"> Monday - Friday</span></p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-[5px]">
                                    <div className="pt-[5px]">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_129_4596)">
                                                <path d="M8 4H7V9H11V8H8V4Z" fill="#535862" />
                                                <path d="M16 7V3L14.9 4.1C13.6 1.6 11 0 8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C10.4 16 12.6 14.9 14 13.2L12.5 11.9C11.4 13.2 9.8 14 8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C10.4 2 12.5 3.5 13.5 5.5L12 7H16Z" fill="#535862" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_129_4596">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    </div>
                                    <div className="max-w-[204px]">
                                        <p className="text-[#535862] text-[16px] font-normal"><span className="inline-block font-bold">Opening Time: </span> <span className="block"> 10am prompt</span></p>
                                    </div>
                                </div>

                               <div className="flex items-start gap-[5px]">
                                    <div className="pt-[5px]">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_129_4596)">
                                                <path d="M8 4H7V9H11V8H8V4Z" fill="#535862" />
                                                <path d="M16 7V3L14.9 4.1C13.6 1.6 11 0 8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C10.4 16 12.6 14.9 14 13.2L12.5 11.9C11.4 13.2 9.8 14 8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C10.4 2 12.5 3.5 13.5 5.5L12 7H16Z" fill="#535862" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_129_4596">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    </div>
                                    <div className="max-w-[204px]">
                                        <p className="text-[#535862] text-[16px] font-normal"><span className="inline-block font-bold">Opening Time: </span> <span className="block"> 9am prompt</span></p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-[5px]">
                                    <div className="pt-[5px]">
                                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.75 0.75C4.75 0.334375 4.41563 0 4 0C3.58437 0 3.25 0.334375 3.25 0.75V2H2C0.896875 2 0 2.89687 0 4V14C0 15.1031 0.896875 16 2 16H12C13.1031 16 14 15.1031 14 14V4C14 2.89687 13.1031 2 12 2H10.75V0.75C10.75 0.334375 10.4156 0 10 0C9.58438 0 9.25 0.334375 9.25 0.75V2H4.75V0.75ZM1.5 6H4V7.75H1.5V6ZM1.5 9.25H4V11.25H1.5V9.25ZM5.5 9.25H8.5V11.25H5.5V9.25ZM10 9.25H12.5V11.25H10V9.25ZM12.5 7.75H10V6H12.5V7.75ZM12.5 12.75V14C12.5 14.275 12.275 14.5 12 14.5H10V12.75H12.5ZM8.5 12.75V14.5H5.5V12.75H8.5ZM4 12.75V14.5H2C1.725 14.5 1.5 14.275 1.5 14V12.75H4ZM8.5 7.75H5.5V6H8.5V7.75Z" fill="#535862" />
                                        </svg>
                                    </div>
                                    <div className="max-w-[204px]">
                                        <p className="text-[#535862] text-[16px] font-normal"><span className="inline-block font-bold">Contact:  </span> +2345678909</p>
                                    </div>
                                </div>

                                 <div className="flex items-start gap-[5px]">
                                    <div className="pt-[5px]">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clipPath="url(#clip0_129_4596)">
                                                <path d="M8 4H7V9H11V8H8V4Z" fill="#535862" />
                                                <path d="M16 7V3L14.9 4.1C13.6 1.6 11 0 8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C10.4 16 12.6 14.9 14 13.2L12.5 11.9C11.4 13.2 9.8 14 8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C10.4 2 12.5 3.5 13.5 5.5L12 7H16Z" fill="#535862" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_129_4596">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    </div>
                                    <div className="max-w-[204px]">
                                        <p className="text-[#535862] text-[16px] font-normal"><span className="inline-block font-bold">Email Address:  </span> <span className="block"> Falconsforexacademy@gmail.com</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                
            </div>
        </section>

    );

}