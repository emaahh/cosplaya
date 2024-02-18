'use client'
import { useState, useEffect } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/Personali/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

import { LoaderIcon } from "lucide-react"

import { useMediaQuery } from 'react-responsive'

import Fade from '@mui/material/Fade';

import Link from "next/link"

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://cosplaya.pockethost.io');



export default function MobileNav() {

    const isDesktopOrLaptop = useMediaQuery({ query: '(min-width: 1224px)' })
	const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })
   
    return (
        <>
            {
                isTabletOrMobile&&
                    <p className="fixed bottom-0 flex justify-center w-screen opacity-50 pb-1">NAVBAR MOBILE</p>
                
            }
        </>
    )
}