import "../App.css";
import { Footer } from "./Footer.tsx";

'use client'

import { Fragment, useState } from 'react'
import { Dialog, DialogPanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
    ArrowDownCircleIcon,
    ArrowPathIcon,
    ArrowUpCircleIcon,
    Bars3Icon,
    EllipsisHorizontalIcon,
    PlusSmallIcon,
} from '@heroicons/react/20/solid'
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

const navigation = [
    { name: 'Home', href: '#' },
    { name: 'Invoices', href: '#' },
    { name: 'Clients', href: '#' },
    { name: 'Expenses', href: '#' },
]

const stats = [
    { name: 'Revenue', value: '$405,091.00', change: '+4.75%', changeType: 'positive' },
    { name: 'Overdue invoices', value: '$12,787.00', change: '+54.02%', changeType: 'negative' },
    { name: 'Outstanding invoices', value: '$245,988.00', change: '-1.39%', changeType: 'positive' },
    { name: 'Expenses', value: '$30,156.00', change: '+10.18%', changeType: 'negative' },
]
const statuses = {
    Paid: 'text-green-700 bg-green-50 ring-green-600/20',
    Withdraw: 'text-gray-600 bg-gray-50 ring-gray-500/10',
    Overdue: 'text-red-700 bg-red-50 ring-red-600/10',
}
const days = [
    {
        date: 'Today',
        dateTime: '2023-03-22',
        transactions: [
            {
                id: 1,
                invoiceNumber: '00012',
                href: '#',
                amount: '$7,600.00 USD',
                tax: '$500.00',
                status: 'Paid',
                client: 'Reform',
                description: 'Website redesign',
                icon: ArrowUpCircleIcon,
            },
            {
                id: 2,
                invoiceNumber: '00011',
                href: '#',
                amount: '$10,000.00 USD',
                status: 'Withdraw',
                client: 'Tom Cook',
                description: 'Salary',
                icon: ArrowDownCircleIcon,
            },
            {
                id: 3,
                invoiceNumber: '00009',
                href: '#',
                amount: '$2,000.00 USD',
                tax: '$130.00',
                status: 'Overdue',
                client: 'Tuple',
                description: 'Logo design',
                icon: ArrowPathIcon,
            },
        ],
    },
    {
        date: 'Yesterday',
        dateTime: '2023-03-21',
        transactions: [
            {
                id: 4,
                invoiceNumber: '00010',
                href: '#',
                amount: '$14,000.00 USD',
                tax: '$900.00',
                status: 'Paid',
                client: 'SavvyCal',
                description: 'Website redesign',
                icon: ArrowUpCircleIcon,
            },
        ],
    },
]
const clients = [
    {
        id: 1,
        name: 'Tuple',
        imageUrl: 'https://tailwindui.com/img/logos/48x48/tuple.svg',
        lastInvoice: { date: 'December 13, 2022', dateTime: '2022-12-13', amount: '$2,000.00', status: 'Overdue' },
    },
    {
        id: 2,
        name: 'SavvyCal',
        imageUrl: 'https://tailwindui.com/img/logos/48x48/savvycal.svg',
        lastInvoice: { date: 'January 22, 2023', dateTime: '2023-01-22', amount: '$14,000.00', status: 'Paid' },
    },
    {
        id: 3,
        name: 'Reform',
        imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
        lastInvoice: { date: 'January 23, 2023', dateTime: '2023-01-23', amount: '$7,600.00', status: 'Paid' },
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export const Deals = () => {
    return (
        <div className="w-screen h-screen">
            <main className="py-16 sm:py-24 lg:py-29">
                <div className="relative isolate overflow-hidden">
                    {/* Secondary navigation */}
                    <header className="pb-4 pt-6 sm:pb-6">
                        <div
                            className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
                            <h1 className="text-base font-semibold leading-7 text-gray-900">Deals</h1>
                            <a
                                href="#"
                                className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                <PlusSmallIcon aria-hidden="true" className="-ml-1.5 h-5 w-5"/>
                                New deal
                            </a>
                        </div>
                    </header>
                </div>

                <div className="space-y-16 xl:space-y-20">
                    {/* Recent activity table */}
                    <div>
                        <div className="mt-6 overflow-hidden border-t border-gray-100">
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
                                        {days.map((day) => (
                                            <Fragment key={day.dateTime}>
                                                <tr className="text-sm leading-6 text-gray-900">
                                                    <th scope="colgroup" colSpan={3}
                                                        className="relative isolate py-2 font-semibold">
                                                        <time dateTime={day.dateTime}>{day.date}</time>
                                                        <div
                                                            className="absolute inset-y-0 right-full -z-10 w-screen border-b border-gray-200 bg-gray-50"/>
                                                        <div
                                                            className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-gray-200 bg-gray-50"/>
                                                    </th>
                                                </tr>
                                                {day.transactions.map((transaction) => (
                                                    <tr key={transaction.id}>
                                                        <td className="relative py-5 pr-6">
                                                            <div className="flex gap-x-6">
                                                                <transaction.icon
                                                                    aria-hidden="true"
                                                                    className="hidden h-6 w-5 flex-none text-gray-400 sm:block"
                                                                />
                                                                <div className="flex-auto">
                                                                    <div className="flex items-start gap-x-3">
                                                                        <div
                                                                            className="text-sm font-medium leading-6 text-gray-900">
                                                                            {transaction.amount}
                                                                        </div>
                                                                        <div
                                                                            className={classNames(
                                                                                statuses[transaction.status],
                                                                                'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                                                                            )}
                                                                        >
                                                                            {transaction.status}
                                                                        </div>
                                                                    </div>
                                                                    {transaction.tax ? (
                                                                        <div
                                                                            className="mt-1 text-xs leading-5 text-gray-500">{transaction.tax} tax</div>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div
                                                                className="absolute bottom-0 right-full h-px w-screen bg-gray-100"/>
                                                            <div
                                                                className="absolute bottom-0 left-0 h-px w-screen bg-gray-100"/>
                                                        </td>
                                                        <td className="hidden py-5 pr-6 sm:table-cell">
                                                            <div
                                                                className="text-sm leading-6 text-gray-900">{transaction.client}</div>
                                                            <div
                                                                className="mt-1 text-xs leading-5 text-gray-500">{transaction.description}</div>
                                                        </td>
                                                        <td className="py-5 text-right">
                                                            <div className="flex justify-end">
                                                                <a
                                                                    href={transaction.href}
                                                                    className="text-sm font-medium leading-6 text-indigo-600 hover:text-indigo-500"
                                                                >
                                                                    View<span
                                                                    className="hidden sm:inline"> transaction</span>
                                                                    <span className="sr-only">
                                      , invoice #{transaction.invoiceNumber}, {transaction.client}
                                    </span>
                                                                </a>
                                                            </div>
                                                            <div className="mt-1 text-xs leading-5 text-gray-500">
                                                                Invoice <span
                                                                className="text-gray-900">#{transaction.invoiceNumber}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </Fragment>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    )
}