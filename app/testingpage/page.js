"use client"
import { Button } from "@/components/Personali/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel"
import {Drawer,DrawerClose,DrawerContent,DrawerDescription,DrawerFooter,DrawerHeader,DrawerTitle,DrawerTrigger,} from "@/components/ui/drawer"
  
import Post from "@/components/Personali/postComponent"

import { LoaderIcon, Heart, MessageCircleMore, Pin, Maximize2 } from "lucide-react"


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
    const [largeFoto, setLargeFoto] = useState(false);

    const adjustColor = chroma(colore).luminance() < 0.025? chroma(colore).brighten(4) : chroma(colore).darken()

    useEffect(() => {
        if(!logged){
            router.push('/account/loginregister')
        }
    }, []);
    
    

    return (
        <div style={{backgroundColor: chroma(colore).brighten(2.5)}}>
            <h1>test</h1>
            
            

            <h1>Loggato come: {pb.authStore.model? pb.authStore.model.username : null}</h1>

            <p style={{color: adjustColor}}>Ciao</p>
            <br/>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold pt-5 title" style={{color: adjustColor}}>CosPlaya</h1>
            <br/>
            <Button adjustColor={adjustColor}>Ciao</Button>
            <br/>
            <Colorful disableAlpha color={colore} onChange={(color) => {setColore(color.hex)}}/>

            <div className="container">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold pt-5 ">Ultimi post</h1>
                <br/>

               
                <div className="grid justify-center">
                    <Post/>
                    <Post/>
                </div>
            </div>

           
                    
            <br/>
            <br/>
        </div>
    )
}
