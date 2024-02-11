"use client"
import { Button } from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"


import { Upload } from 'lucide-react';
import { LoaderIcon } from "lucide-react"


import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


import chroma from "chroma-js"
import { Colorful } from '@uiw/react-color';


import { useState, useEffect } from 'react';

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://cosplaya.pockethost.io');


export default function Home() {
    const router = useRouter()


    const { toast } = useToast()

    const [logged, setLogged] = useState(pb.authStore.isValid);
    const [colore, setColore] = useState('#000')

    const adjustColor = chroma(colore).luminance() < 0.025? chroma(colore).brighten(4) : chroma(colore).darken()

    useEffect(() => {
        if(!logged){
            router.push('/account/loginregister')
        }
    }, []);
    
    

    return (
        <div style={{backgroundColor: chroma(colore).brighten(2.5)}}>
            <h1>HOME</h1>
            
            <h1>Loggato come: {pb.authStore.model? pb.authStore.model.username : null}</h1>

            
        </div>
    )
}
