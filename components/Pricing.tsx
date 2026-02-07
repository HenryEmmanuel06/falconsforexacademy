import Link from "next/link";
import Image from "next/image";

export default function Pricing() {
    return (
        <section className="py-[50px] md:py-[70px] lg:py-[100px] bg-[#091B25]">
            <div className="container">
                <h2 className="text-[28px] md:text-[32px] lg:text-[40px] text-center text-white font-medium">Simple, Transparent Pricing</h2>
                <p className="text-[18px] md:text-[20px] text-center text-white font-normal max-w-[570px] mx-auto">Whether monthly or lifetime, at Falconsforexacademy we got a program for you.</p>
                <div className="pt-[40px] md:pt-[80px]">
                    <div className="flex flex-col lg:flex-row gap-[35px]">
                        {/* <!-- Card --> */}
                        <div className="border-[5px] flex flex-col rounded-[30px] py-[40px] px-[30px] border-[#CC5DF980] bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.22)_0%,rgba(168,85,247,0.12)_25%,rgba(168,85,247,0.05)_45%,transparent_60%),linear-gradient(180deg,#ffffff_0%,#ffffff_100%)]">

                            {/* <!-- Icon --> */}
                            <div className="w-[40px] h-[40px] flex items-center justify-center rounded-[5px] bg-[#CC5DF9] mb-[20px]">
                                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.55 16.2L11.725 10H7.725L8.45 4.325L3.825 11H7.3L6.55 16.2ZM4 20L5 13H0L9 0H11L10 8H16L6 20H4Z" fill="white" />
                                </svg>

                            </div>

                            {/* <!-- Title --> */}
                            <h2 className="text-[18px] md:text-[20px] font-bold text-[#091B25]">1 Month Plan</h2>

                            {/* <!-- Price --> */}
                            <div className="">
                                <span className="text-[30px] md:text-[36px] font-bold text-[#CC5DF9]">$150</span>
                                <span className="text-[14px] md:text-[16px] font-medium text-[#091B25]">/Monthly</span>
                            </div>

                            {/* <!-- Divider --> */}
                            <div className="w-full h-[2px] bg-[#CC5DF9] mt-[10px]"></div>

                            {/* <!-- Payments --> */}
                            <p className="text-[14px] font-bold text-[#091B25] pt-[14px] pb-[30px]">
                                Payments available on:
                                <span className="inline-flex items-center gap-2 ml-2">
                                    <span className="text-white bg-[#CC5DF9] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#CC5DF9] font-bold">₿</span>
                                    <span className="text-white bg-[#CC5DF9] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#CC5DF9] font-bold">$</span>
                                    <span className="text-white bg-[#CC5DF9] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#CC5DF9] font-bold">₦</span>
                                </span>
                            </p>

                            {/* <!-- Features --> */}
                            <ul className="space-y-3 text-sm text-[#091B25]">
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Physical ClassNameroom Trainings
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Live Market Breakdown & Trade Execution
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Price Action Trade Setups & Entry Models
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Market Structure & Candlestick Analysis
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Risk Management & Trading Psychology Basics
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly Physical Q&A Session
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#CC5DF9] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly Market Analysis
                                </li>
                            </ul>
                            <div className="pt-[40px] md:pt-[90px] mt-auto">
                                {/* <!-- Button --> */}
                                <button className="w-full mt-auto py-3 rounded-full border-2 border-[#CC5DF9] text-[#CC5DF9] font-medium hover:bg-[#CC5DF9] hover:text-white transition cursor-pointer">
                                    Get Started
                                </button>
                            </div>
                        </div>



                        {/* <!-- Card --> */}
                        <div className="border-[5px] flex flex-col rounded-[30px] py-[40px] px-[30px] border-[#091B2580]  bg-[radial-gradient(circle_at_top_right,rgba(9,27,37,0.22)_0%,rgba(9,27,37,0.12)_25%,rgba(9,27,37,0.05)_45%,transparent_60%),linear-gradient(180deg,#ffffff_0%,#ffffff_100%)]">

                            {/* <!-- Icon --> */}
                            <div className="w-[40px] h-[40px] flex items-center justify-center rounded-[5px] bg-[#091B25] mb-[20px]">
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.78704 19.25L6.31204 14.65L1.71204 12.175L3.48704 10.425L7.11204 11.05L9.66204 8.5L1.73704 5.125L3.83704 2.975L13.462 4.675L16.562 1.575C16.9454 1.19167 17.4204 1 17.987 1C18.5537 1 19.0287 1.19167 19.412 1.575C19.7954 1.95833 19.987 2.42917 19.987 2.9875C19.987 3.54583 19.7954 4.01667 19.412 4.4L16.287 7.525L17.987 17.125L15.862 19.25L12.462 11.325L9.91204 13.875L10.562 17.475L8.78704 19.25Z" stroke="white" strokeWidth="2" />
                                </svg>


                            </div>

                            {/* <!-- Title --> */}
                            <h2 className="text-[18px] md:text-[20px] font-bold text-[#091B25]">3 Months Plan</h2>

                            {/* <!-- Price --> */}
                            <div className="">
                                <span className="text-[30px] md:text-[36px] font-bold text-[#091B25]">$250</span>
                                <span className="text-[14px] md:text-[16px] font-medium text-[#091B25]">/Quarterly</span>
                            </div>

                            {/* <!-- Divider --> */}
                            <div className="w-full h-[2px] bg-[#091B25] mt-[10px]"></div>

                            {/* <!-- Payments --> */}
                            <p className="text-[14px] font-bold text-[#091B25] pt-[14px] pb-[30px]">
                                Payments available on:
                                <span className="inline-flex items-center gap-2 ml-2">
                                    <span className="text-white bg-[#091B25] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#091B25] font-bold">₿</span>
                                    <span className="text-white bg-[#091B25] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#091B25] font-bold">$</span>
                                    <span className="text-white bg-[#091B25] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#091B25] font-bold">₦</span>
                                </span>
                            </p>

                            {/* <!-- Features --> */}
                            <ul className="space-y-3 text-sm text-[#091B25]">
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Physical ClassNameroom Trainings
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Live Market Breakdown & Trade Execution
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly Market & Advanced Top-Down Analysis
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Advanced Price Action Setups & Trade Execution
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Market Structure, Trend & Key Level Identification
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Advanced Risk Management & Psychology
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly Physical Q&A & Trade Review Sessions
                                </li>
                            </ul>
                            <div className="pt-[40px] md:pt-[90px]">
                                {/* <!-- Button --> */}
                                <button className="mt-auto w-full py-3 rounded-full border-2 border-[#091B25] text-[#091B25] font-medium hover:bg-[#091B25] hover:text-white transition cursor-pointer">
                                    Get Started
                                </button>
                            </div>


                        </div>




                        {/* <!-- Card --> */}
                        <div className="border-[5px] flex flex-col rounded-[30px] py-[40px] px-[30px] border-[#FF851380]  bg-[radial-gradient(circle_at_top_right,rgba(255,133,19,0.22)_0%,rgba(255,133,19,0.12)_25%,rgba(255,133,19,0.05)_45%,transparent_60%),linear-gradient(180deg,#ffffff_0%,#ffffff_100%)]">

                            {/* <!-- Icon --> */}
                            <div className="w-[40px] h-[40px] flex items-center justify-center rounded-[5px] bg-[#FF8513] mb-[20px]">
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.78704 19.25L6.31204 14.65L1.71204 12.175L3.48704 10.425L7.11204 11.05L9.66204 8.5L1.73704 5.125L3.83704 2.975L13.462 4.675L16.562 1.575C16.9454 1.19167 17.4204 1 17.987 1C18.5537 1 19.0287 1.19167 19.412 1.575C19.7954 1.95833 19.987 2.42917 19.987 2.9875C19.987 3.54583 19.7954 4.01667 19.412 4.4L16.287 7.525L17.987 17.125L15.862 19.25L12.462 11.325L9.91204 13.875L10.562 17.475L8.78704 19.25Z" stroke="white" strokeWidth="2" />
                                </svg>


                            </div>

                            {/* <!-- Title --> */}
                            <h2 className="text-[18px] md:text-[20px] font-bold text-[#091B25]">6 Months Plan</h2>

                            {/* <!-- Price --> */}
                            <div className="">
                                <span className="text-[30px] md:text-[36px] font-bold text-[#FF8513]">$450</span>
                                <span className="text-[14px] md:text-[16px] font-medium text-[#091B25]">/Biannual</span>
                            </div>

                            {/* <!-- Divider --> */}
                            <div className="w-full h-[2px] bg-[#091B25] mt-[10px]"></div>

                            {/* <!-- Payments --> */}
                            <p className="text-[14px] font-bold text-[#091B25] pt-[14px] pb-[30px]">
                                Payments available on:
                                <span className="inline-flex items-center gap-2 ml-2">
                                    <span className="text-white bg-[#FF8513] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#FF8513] font-bold">₿</span>
                                    <span className="text-white bg-[#FF8513] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#FF8513] font-bold">$</span>
                                    <span className="text-white bg-[#FF8513] w-[25px] h-[25px] flex justify-center items-center rounded-full text-[16px] bg-[#FF8513] font-bold">₦</span>
                                </span>
                            </p>

                            {/* <!-- Features --> */}
                            <ul className="space-y-3 text-sm text-[#091B25]">
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Physical ClassNameroom Trainings
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Live Market Breakdown & Trade Execution
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly Market & Advanced Top-Down Analysis
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Advanced Price Action Setups & Trade Execution
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Market Structure, Trend & Key Level Identification
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Advanced Risk Management & Psychology
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#FF8513] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                    </svg>
                                    </span>
                                    Weekly Physical Q&A & Trade Review Sessions
                                </li>
                            </ul>
                            <div className="pt-[40px] md:pt-[90px]">
                                {/* <!-- Button --> */}
                                <button className="mt-auto w-full py-3 rounded-full border-2 border-[#FF8513] text-[#FF8513] font-medium hover:bg-[#FF8513] hover:text-white transition cursor-pointer">
                                    Get Started
                                </button>
                            </div>


                        </div>
                    </div>
                </div>

                <div className="bg-[#CED8DD]">
                    <div>
                        <h3>Premium Signals</h3>
                        <p>Minimum 1:5 Risk-to-Reward ratio</p>
                        <div className="flex">
                            <div className="flex items-start gap-2">
                                <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                </svg>
                                </span>
                                2-5 high-quality signals per week
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                </svg>
                                </span>
                                2-5 high-quality signals per week
                            </div>
                        </div>
                        <div className="flex">
                            <div className="flex items-start gap-2">
                                <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                </svg>
                                </span>
                                2-5 high-quality signals per week
                            </div>
                            <div className="flex items-start gap-2">
                                <span className="w-[24px] h-[24px] flex items-center justify-center rounded-full bg-[#091B25] text-white text-xs"><svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.7464 0.274437L3.58641 7.18444L1.68641 5.15444C1.33641 4.82444 0.786406 4.80444 0.386406 5.08444C-0.00359413 5.37444 -0.113594 5.88444 0.126406 6.29444L2.37641 9.95444C2.59641 10.2944 2.97641 10.5044 3.40641 10.5044C3.81641 10.5044 4.20641 10.2944 4.42641 9.95444C4.78641 9.48444 11.6564 1.29444 11.6564 1.29444C12.5564 0.374437 11.4664 -0.435563 10.7464 0.264437V0.274437Z" fill="white" />
                                </svg>
                                </span>
                                2-5 high-quality signals per week
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );

}