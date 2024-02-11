'use client'
import { useState, useEffect } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

import { LoaderIcon } from "lucide-react"


import Fade from '@mui/material/Fade';

import Link from "next/link"

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://cosplaya.pockethost.io');



export default function Footer() {
    const [versione, setVersione] = useState()
    const [loading, setLoading] = useState(true)
	const ControlloVersione = async () => {
        try {
            const InfoVersione = await pb.collection('InfoProduzione').getFullList({sort: '-created',});
            if(InfoVersione){
                setLoading(false)
                setVersione(InfoVersione[0].versione)
            }
        }catch (e) {
            return
        }
	}
    useEffect(()=>{
        ControlloVersione()
    },[])
    
    return (
        <p className="fixed bottom-0 flex justify-center w-screen opacity-50 pb-1">fase:&nbsp;{loading? <LoaderIcon className="animate-spin"/> : versione}&nbsp;made by&nbsp;<a className="underline" target="_blank" href="https://instagram.com/_emaahh_">emaahh</a></p>
    )
}