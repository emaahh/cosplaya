import { Inter } from 'next/font/google'
import './globals.css'
import localFont from 'next/font/local'

import { Toaster } from "@/components/ui/toaster"

import Footer from '@/components/Personali/footer'
import Navbar from '@/components/Personali/navbar'
import MobileNav from '@/components/Personali/mobileNav'


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'CosPlaya',
	description: 'testttt',
}

export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
}

export default function RootLayout({ children }) {



	return (
		<html lang="it">
			<body className={inter.className}>
				<Navbar/>
				{children}
				<Toaster />
				<MobileNav/>
			</body>
		</html>
	)
}