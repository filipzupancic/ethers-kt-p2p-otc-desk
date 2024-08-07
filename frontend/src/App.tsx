'use client'

import "./App.css";
import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home.tsx';
import { Deals } from './pages/Deals.tsx';
import spring from "./assets/spring.svg";
import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import {useWallet, WalletProvider} from "./WalletContext.tsx";

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Deals', href: '/deals' },
]

const injected = injectedModule();

init({
    wallets: [injected],
    chains: [
        {
            id: "0x2105",
            token: "ETH",
            label: "Base",
            rpcUrl: "https://base.llamarpc.com",
        }
    ],
    appMetadata: {
        name: "Ethers Kt Splitwise",
        icon: spring,
        description: "Ethers-kt splitwise",
    },
});

const AppContent = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { wallet, connect } = useWallet();

    const handleConnect = async () => {
        await connect();
    };

    return (
        <div>
            <header className="bg-white w-screen">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img alt="" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                 className="h-8 w-auto"/>
                        </a>
                    </div>
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="h-6 w-6"/>
                        </button>
                    </div>
                    <div className="hidden lg:flex lg:gap-x-12">
                        {navigation.map((item) => (
                            <Link key={item.name} to={item.href}
                                  className="text-sm font-semibold leading-6 text-gray-900">
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                        {!wallet && (
                            <button onClick={handleConnect} className="text-sm font-semibold leading-6 text-gray-900">
                                <span>Connect Wallet</span>
                            </button>
                        )}
                    </div>
                </nav>
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                    <div className="fixed inset-0 z-10"/>
                    <DialogPanel
                        className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <a href="#" className="-m-1.5 p-1.5">
                                <span className="sr-only">Your Company</span>
                                <img alt="" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                                     className="h-8 w-auto"/>
                            </a>
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon aria-hidden="true" className="h-6 w-6"/>
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="py-6">
                                    {!wallet && (
                                        <button
                                            onClick={() => {
                                                handleConnect().then(() => {
                                                });
                                                setMobileMenuOpen(false);
                                            }}
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            <span>Connect Wallet</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/deals" element={<Deals/>}/>
            </Routes>
        </div>
    );
};

export const App: React.FC = () => {
    return (
        <WalletProvider>
            <Router>
                <AppContent />
            </Router>
        </WalletProvider>
    );
};