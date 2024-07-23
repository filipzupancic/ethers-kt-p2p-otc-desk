import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import injectedModule from "@web3-onboard/injected-wallets";
import { init, useConnectWallet, ConnectedWallet } from "@web3-onboard/react";
import Web3 from "web3";
import spring from "./assets/spring.svg";

interface WalletContextProps {
    wallet: ConnectedWallet | null;
    connect: () => Promise<void>;
    web3: Web3 | null;
    account: string | null;
}

const WalletContext = createContext<WalletContextProps | undefined>(undefined);

const injected = injectedModule();

init({
    wallets: [injected],
    chains: [
        {
            id: "0x1",
            token: "ETH",
            label: "Mainnet",
            rpcUrl: "http://reth-1.kriptal.io:8545",
        },
    ],
    appMetadata: {
        name: "Ethers Kt Splitwise",
        icon: spring,
        description: "Ethers-kt splitwise",
    },
});

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [{ wallet }, connect] = useConnectWallet();
    const [web3, setWeb3] = useState<Web3 | null>(null);
    const [account, setAccount] = useState<string | null>(null);

    useEffect(() => {
        if (wallet) setWeb3(new Web3(wallet.provider));
    }, [wallet]);

    useEffect(() => {
        if (web3) {
            web3.eth.getAccounts().then((res) => setAccount(res[0]));
        }
    }, [web3]);

    const handleConnect = async () => {
        try {
            await connect();
        } catch (error) {
            console.error("Failed to connect wallet", error);
        }
    };

    return (
        <WalletContext.Provider value={{ wallet, connect: handleConnect, web3, account }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = (): WalletContextProps => {
    const context = useContext(WalletContext);

    if (!context) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};
