import "../App.css";
import { Footer } from "./Footer.tsx";
import { useWallet } from "../WalletContext.tsx";
import { Fragment, useEffect, useState } from 'react';
import { ArrowPathIcon, PlusSmallIcon } from '@heroicons/react/20/solid';

interface Deal {
    id: number;
    userA: string;
    userB: string;
    tokenA: string;
    tokenB: string;
    amountA: number;
    amountB: number;
    userADeposited: boolean;
    userBDeposited: boolean;
}

const statuses = {
    Paid: 'text-green-700 bg-green-50 ring-green-600/20',
    Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
    Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
    Deposited: 'text-green-700 bg-green-50 ring-green-600/20',
    Pending: 'text-yellow-700 bg-yellow-50 ring-yellow-600/20',
};

const contractABI = [
    {
        "inputs": [
            { "internalType": "address", "name": "_userB", "type": "address" },
            { "internalType": "address", "name": "_tokenA", "type": "address" },
            { "internalType": "address", "name": "_tokenB", "type": "address" },
            { "internalType": "uint256", "name": "_amountA", "type": "uint256" },
            { "internalType": "uint256", "name": "_amountB", "type": "uint256" }
        ],
        "name": "createDeal",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_dealId",
                "type": "uint256"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_dealId",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export const Deals = () => {
    const { wallet, connect, web3, account } = useWallet();
    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewDealForm, setShowNewDealForm] = useState(false);
    const [userB, setUserB] = useState('');
    const [tokenA, setTokenA] = useState('');
    const [tokenB, setTokenB] = useState('');
    const [amountA, setAmountA] = useState(0);
    const [amountB, setAmountB] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchDeals = async () => {
            if (account) {
                console.log(`Fetching deals for account: ${account}`);
                try {
                    const response = await fetch(`https://backend.ammpear.xyz:8080/deals/all`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch deals');
                    }
                    const data: Deal[] = await response.json();
                    console.log(data);
                    setDeals(data);
                } catch (error) {
                    console.error('Error fetching deals:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchDeals();
    }, [account]);

    const createDeal = async () => {
        if (web3 && account) {
            const contractAddress = "0x4038cf00104d62d7948aa2F246a47F12e90C2Be6";
            const contract = new web3.eth.Contract(contractABI, contractAddress);

            try {
                const txOptions = {
                    from: account,
                };

                // Estimate the gas required for the transaction
                const gasEstimate = await contract.methods.createDeal(userB, tokenA, tokenB, amountA, amountB).estimateGas(txOptions);

                // Set a custom gas limit (usually slightly above the estimate)
                const gasLimit = Math.floor(Number(gasEstimate) * 1.2); // Convert gasEstimate to number and increase by 20% to be safe

                // Set the gas price (Base chain may have specific gas price recommendations)
                const gasPrice = await web3.eth.getGasPrice(); // Get current gas price

                // Add the gas estimate and custom gas price to the transaction options
                const newTxOptions = {
                    from: account,
                    gas: gasLimit.toString(),
                    gasPrice: gasPrice.toString(),
                };

                const result = await contract.methods.createDeal(userB, tokenA, tokenB, amountA, amountB).send(newTxOptions);
                console.log('Deal created successfully:', result);
                setSuccess('Deal created successfully!');
                setError(null);
                setShowNewDealForm(false);
            } catch (error) {
                console.error('Failed to create deal:', error);
                setError(`Failed to create deal: ${error}`);
                setSuccess(null);
            }
        }
    };


    const deposit = async (_dealId: number) => {
        if (web3 && account) {
            const contractAddress = "0x4038cf00104d62d7948aa2F246a47F12e90C2Be6";
            const contract = new web3.eth.Contract(contractABI, contractAddress);

            try {
                const txOptions = {
                    from: account,
                };

                console.log('Depositing', _dealId);

                // Estimate the gas required for the transaction
                const gasEstimate = await contract.methods.deposit(_dealId).estimateGas(txOptions);
                console.log('Gas estimate:', gasEstimate);

                // Set a custom gas limit (usually slightly above the estimate)
                const gasLimit = Math.floor(Number(gasEstimate) * 1.2); // Convert gasEstimate to number and increase by 20% to be safe

                // Set the gas price (Base chain may have specific gas price recommendations)
                const gasPrice = await web3.eth.getGasPrice(); // Get current gas price
                console.log('Gas price:', gasPrice);

                // Add the gas estimate and custom gas price to the transaction options
                const newTxOptions = {
                    from: account,
                    gas: gasLimit.toString(),
                    gasPrice: gasPrice.toString(),
                };

                await contract.methods.deposit(_dealId).send(newTxOptions);
                console.log('Deposited successfully');
            } catch (error) {
                console.error('Failed to deposit:', error);
            }
        }
    };

    const withdraw = async (_dealId: number) => {
        if (web3 && account) {
            const contractAddress = "0x4038cf00104d62d7948aa2F246a47F12e90C2Be6";
            const contract = new web3.eth.Contract(contractABI, contractAddress);

            try {
                const txOptions = {
                    from: account,
                };

                console.log('Withdrawing', _dealId);

                // Estimate the gas required for the transaction
                const gasEstimate = await contract.methods.withdraw(_dealId).estimateGas(txOptions);
                console.log('Gas estimate:', gasEstimate);

                // Set a custom gas limit (usually slightly above the estimate)
                const gasLimit = Math.floor(Number(gasEstimate) * 1.2); // Convert gasEstimate to number and increase by 20% to be safe

                // Set the gas price (Base chain may have specific gas price recommendations)
                const gasPrice = await web3.eth.getGasPrice(); // Get current gas price
                console.log('Gas price:', gasPrice);

                const newTxOptions = {
                    from: account,
                    gas: gasLimit.toString(),
                    gasPrice: gasPrice.toString(),
                };

                await contract.methods.withdraw(_dealId).send(newTxOptions);
                console.log('Withdrawn successfully');
            } catch (error) {
                console.error('Failed to withdraw:', error);
            }
        }
    };

    return (
        <div className="bg-white">
            <main className="py-16 sm:py-24 lg:py-29">
                {!wallet && (
                    <div className="three-column-layout">
                        <div className="column"></div>
                        <div className="column center-column">
                            <div id="deals-no-wallet" className="w-full max-w-md">
                                <p className="mt-1 text-sm text-gray-500">Connect your wallet to see your deals.</p>
                                <button onClick={connect} className="w-full mt-5 bg-blue-500 rounded-lg p-2 text-white">
                                    <span>Connect Wallet</span>
                                </button>
                            </div>
                        </div>
                        <div className="column"></div>
                    </div>
                )}
                {wallet && loading && <p>Loading deals...</p>}
                {wallet && !loading && (
                    <>
                        <div className="relative isolate overflow-hidden">
                            <header className="pb-4 pt-6 sm:pb-6">
                                <div
                                    className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
                                    <h1 className="text-base font-semibold leading-7 text-gray-900">Deals</h1>
                                    <button
                                        onClick={() => setShowNewDealForm(true)}
                                        className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        <PlusSmallIcon aria-hidden="true" className="-ml-1.5 h-5 w-5"/>
                                        New deal
                                    </button>
                                </div>
                            </header>
                        </div>

                        {showNewDealForm && (
                            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                        Create a new deal
                                    </h2>
                                </div>

                                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                                    <div className="modal space-y-6">
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="password"
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    User B Address
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <input
                                                    id="userB"
                                                    name="userB"
                                                    type="text"
                                                    placeholder=" 0x0"
                                                    value={userB}
                                                    onChange={(e) => setUserB(e.target.value)}
                                                    required
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="password"
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    Token A Address
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <input
                                                    id="tokenA"
                                                    name="tokenA"
                                                    type="text"
                                                    placeholder=" 0x0"
                                                    value={tokenA}
                                                    onChange={(e) => setTokenA(e.target.value)}
                                                    required
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="password"
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    Token B Address
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <input
                                                    id="tokenB"
                                                    name="tokenB"
                                                    type="text"
                                                    placeholder=" 0x0"
                                                    value={tokenB}
                                                    onChange={(e) => setTokenB(e.target.value)}
                                                    required
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="number"
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    Amount A
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <input
                                                    id="amountA"
                                                    name="amountA"
                                                    type="number"
                                                    value={amountA}
                                                    onChange={(e) => setAmountA(parseFloat(e.target.value))}
                                                    required
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between">
                                                <label htmlFor="number"
                                                       className="block text-sm font-medium leading-6 text-gray-900">
                                                    Amount B
                                                </label>
                                            </div>
                                            <div className="mt-2">
                                                <input
                                                    id="amountB"
                                                    name="amountB"
                                                    type="number"
                                                    value={amountB}
                                                    onChange={(e) => setAmountB(parseFloat(e.target.value))}
                                                    required
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <button
                                                onClick={createDeal}
                                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                                Create
                                            </button>
                                            <button
                                                onClick={() => setShowNewDealForm(false)}
                                                className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                                                <span>Cancel</span>
                                            </button>
                                            {error && <p className="text-red-500">{error}</p>}
                                            {success && <p className="text-green-500">{success}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-16 xl:space-y-20">
                            <div>
                                <div className="mt-6 overflow-hidden">
                                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                                            <table className="w-full text-left">
                                                <thead className="sr-only">
                                                <tr>
                                                    <th>Amount</th>
                                                    <th className="hidden sm:table-cell">Client</th>
                                                    <th>More details</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {deals.map((deal) => (
                                                    <Fragment key={deal.id}>
                                                        <tr className="text-sm leading-6 text-gray-900 border-b border-gray-200">
                                                            <th scope="colgroup" colSpan={1}
                                                                className="relative isolate py-2 font-semibold">
                                                                <p>Deal ID: {deal.id}</p>
                                                            </th>
                                                            <th scope="colgroup" colSpan={1}
                                                                className="relative isolate py-2 font-semibold">
                                                                <p>Client</p>
                                                            </th>
                                                        </tr>

                                                        <tr>
                                                            <td className="relative py-5 pr-6">
                                                                <div className="flex gap-x-6">
                                                                    <ArrowPathIcon aria-hidden="true"
                                                                                   className="hidden h-6 w-5 flex-none text-gray-400 sm:block"/>
                                                                    <div className="flex-auto">
                                                                        <div className="flex items-start gap-x-3">
                                                                            <div
                                                                                className="text-sm font-medium leading-6 text-gray-900">
                                                                                {deal.amountA}
                                                                            </div>
                                                                            <div
                                                                                className={classNames(statuses[deal.userADeposited ? 'Deposited' : 'Pending'], 'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset')}>
                                                                                {deal.userADeposited ? 'Deposited' : 'Pending'}
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="mt-1 text-xs leading-5 text-gray-500">Token: {deal.tokenA}</div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="absolute bottom-0 right-full h-px bg-gray-100"/>
                                                                <div
                                                                    className="absolute bottom-0 left-0 h-px bg-gray-100"/>
                                                            </td>
                                                            <td className="hidden py-5 pr-6 sm:table-cell">
                                                                <div
                                                                    className="text-sm leading-6 text-gray-900">{deal.userA}</div>
                                                            </td>
                                                            {account!.toLocaleLowerCase() == deal.userA.toLowerCase() && !deal.userADeposited && (
                                                                <td className="py-5 text-right">
                                                                    <div className="flex justify-end">
                                                                        <button onClick={() => deposit(deal.id)}
                                                                                className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500">
                                                                            Deposit
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {account!.toLocaleLowerCase() == deal.userA.toLowerCase() && deal.userADeposited && (
                                                                <td className="py-5 text-right">
                                                                    <div className="flex justify-end">
                                                                        <p className="text-sm font-medium leading-6 text-green-600">
                                                                            Deposited
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {account!.toLowerCase() == deal.userB.toLowerCase() && deal.userADeposited && deal.userBDeposited && deal.amountA > 0 && (
                                                                <td className="py-5 text-right">
                                                                    <div className="flex justify-end">
                                                                        <button onClick={() => withdraw(deal.id)}
                                                                                className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500">
                                                                            Withdraw
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {account!.toLowerCase() == deal.userB.toLowerCase() && deal.userADeposited && deal.userBDeposited && deal.amountA <= 0 && (
                                                                <td className="py-5 text-right">
                                                                    <div className="flex justify-end">
                                                                        <p className="text-sm font-medium leading-6 text-green-600">
                                                                            Withdrawn
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                            )}
                                                        </tr>

                                                        <tr>
                                                            <td className="relative py-5 pr-6">
                                                                <div className="flex gap-x-6">
                                                                    <ArrowPathIcon aria-hidden="true"
                                                                                   className="hidden h-6 w-5 flex-none text-gray-400 sm:block"/>
                                                                    <div className="flex-auto">
                                                                        <div className="flex items-start gap-x-3">
                                                                            <div
                                                                                className="text-sm font-medium leading-6 text-gray-900">
                                                                                {deal.amountB}
                                                                            </div>
                                                                            <div
                                                                                className={classNames(statuses[deal.userBDeposited ? 'Deposited' : 'Pending'], 'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset')}>
                                                                                {deal.userBDeposited ? 'Deposited' : 'Pending'}
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="mt-1 text-xs leading-5 text-gray-500">Token: {deal.tokenB}</div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className="absolute bottom-0 right-full h-px bg-gray-100"/>
                                                                <div
                                                                    className="absolute bottom-0 left-0 h-px bg-gray-100"/>
                                                            </td>
                                                            <td className="hidden py-5 pr-6 sm:table-cell">
                                                                <div
                                                                    className="text-sm leading-6 text-gray-900">{deal.userB}</div>
                                                            </td>
                                                            {account!.toLowerCase() == deal.userB.toLocaleLowerCase() && !deal.userBDeposited && (
                                                                <td className="py-5 text-right">
                                                                    <div className="flex justify-end">
                                                                        <button onClick={() => deposit(deal.id)}
                                                                                className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500">
                                                                            Deposit
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {account!.toLowerCase() == deal.userB.toLocaleLowerCase() && deal.userBDeposited && (
                                                                <td className="py-5 text-right">
                                                                    <div className="flex justify-end">
                                                                        <p className="text-sm font-medium leading-6 text-green-600">
                                                                            Deposited
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {account!.toLowerCase() == deal.userA.toLowerCase() && deal.userADeposited && deal.userBDeposited && deal.amountB > 0 && (
                                                                <td className="py-5 text-right">
                                                                    <div className="flex justify-end">
                                                                        <button onClick={() => withdraw(deal.id)}
                                                                                className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500">
                                                                            Withdraw
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            )}
                                                            {account!.toLowerCase() == deal.userA.toLowerCase() && deal.userADeposited && deal.userBDeposited && deal.amountB <= 0 && (
                                                                <td className="py-5 text-right">
                                                                    <div className="flex justify-end">
                                                                        <p className="text-sm font-medium leading-6 text-green-600">
                                                                            Withdrawn
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                            )}
                                                        </tr>
                                                    </Fragment>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <Footer/>
        </div>
    );
};
