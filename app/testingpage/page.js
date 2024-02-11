"use client"
import { Button } from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel"
import {Drawer,DrawerClose,DrawerContent,DrawerDescription,DrawerFooter,DrawerHeader,DrawerTitle,DrawerTrigger,} from "@/components/ui/drawer"
  


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
                            <Drawer open={largeFoto} onOpenChange={setLargeFoto} className="h-[25vh]">
                                <DrawerContent>
                                    <DrawerFooter>
                                    <img className=" w-full h-1/2 max-h-[55vh] self-center object-contain  rounded"  src="https://i.pinimg.com/736x/99/4e/8c/994e8c6c41cb42597b63f0f2387e1794.jpg"/>

                                        <DrawerClose>
                                            <Button variant="outline">Chiudi</Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>

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

               
                <div className="flex justify-center">
                    <Card className="w-fit overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between align-middle">
                            <div className="inline-flex flex-row items-center">
                                <Avatar className="flex justify-center items-center mr-2 z-0">
                                    <AvatarImage src={"https://github.com/shadcn.png"} className="object-cover aspect-auto max-w-none"/>
                                    <AvatarFallback><LoaderIcon className="animate-spin"/></AvatarFallback>
                                </Avatar>
                                <CardDescription className="underline"><Link href="/account/emaahh">@emaahh</Link></CardDescription>
                            </div>
                            
                            <CardDescription className="opacity-50 italic">11/02/2024</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <Carousel className="sm:w-[70%] w-[90%] max-w-[400px]">
                                <CarouselContent>
                                    <CarouselItem className="flex align-middle rounded"><img className=" w-full  self-center object-contain  rounded"  src="https://directus.luccacomicsandgames.com/lucca-comics-2022/assets/lcr0qp1stv4o4440?key=directus-large-contain"/></CarouselItem>
                                    <CarouselItem className="flex align-middle rounded"><img className=" w-full  self-center object-contain  rounded"  src="https://i.pinimg.com/736x/99/4e/8c/994e8c6c41cb42597b63f0f2387e1794.jpg"/></CarouselItem>
                                    <CarouselItem className="flex align-middle rounded">...</CarouselItem>
                                </CarouselContent>
                                <CarouselPrevious className="sm:flex hidden"/>
                                <CarouselNext className="sm:flex hidden"/>
                            </Carousel>                            
                        </CardContent>
                        <CardContent className="flex justify-center">
                            <Button onClick={()=>setLargeFoto(true)} ><Maximize2 /></Button>
                        </CardContent>
                        <CardContent className="inline-flex flex-row align-middle">
                            <Heart className="mr-3"/><MessageCircleMore className="mr-3"/><Pin className="mr-3"/>
                        </CardContent>
                        <CardFooter className=" max-w-screen-sm">
                            <p className="text-xs sm:text-sm text-justify">Descrizione bella del posro con ardua rappresentazione di quello che contiene dio cane sto per suicidarmi non funziona una minchia</p>
                        </CardFooter>
                    </Card>
                </div>
            </div>

           
                    
            <br/>
            <br/>
        </div>
    )
}
