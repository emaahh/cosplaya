'use client'
import { useState, useEffect } from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"



import { LoaderIcon, Menu, X } from "lucide-react"


import Fade from '@mui/material/Fade';

import Link from "next/link"
import { useRouter } from 'next/navigation'


import PocketBase from 'pocketbase';
const pb = new PocketBase('https://cosplaya.pockethost.io');



export default function Navbar() {
    const router = useRouter()


    const [logged, setLogged] = useState(pb.authStore.isValid)
    const [menuOpen, setMenuOpen] = useState(false)

    const [avatar, setAvatar] = useState();
    const updateLog = () => {
        setLogged(pb.authStore.isValid)
        if(pb.authStore.model){
            if(pb.authStore.model.avatar) {
                setAvatar(`https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`);
            }else{
                setAvatar('https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png')
            }
        }
    }
    useEffect(() => {
        if (pb.authStore.model) {
            if(pb.authStore.model.avatar) {
                setAvatar(`https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`);
            }else{
                setAvatar('https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png')
            }
        }
    }, [logged]);

    const goToMyAccount = () => {
        if(pb.authStore.model){
            router.push('/account/'+pb.authStore.model.username);
        }
    }
    
    return (
        <div className="h-28">
			<div className="inline-flex flex-col fixed items-center align-middle justify-center w-screen">
                <div className="inline-flex flex-col items-center align-middle">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold pt-5 " style={{fontFamily:'huglove'}}>CosPlaya</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm pb-5">Cos for Fan & Cos for Player</p>
                </div>
				
                <div className="right-0 fixed pr-5">
                    <Sheet open={menuOpen}>
                        <button onClick={()=>{setMenuOpen(!menuOpen), updateLog()}}><Menu /></button>
                        <SheetContent>
                            <div className="flex justify-end">
                                <button onClick={()=>{setMenuOpen(!menuOpen), updateLog()}}><X /></button>
                            </div>
                            {
                                logged?
                                    <Card className="flex border-none shadow-none justify-center items-center flex-col">
                                        <CardHeader className="items-center">

                                            <Avatar className="w-20 h-20 flex items-center aspect-auto">
                                                <AvatarImage src={avatar} className="w-auto h-auto aspect-auto"/>
                                                <AvatarFallback><LoaderIcon className="animate-spin"/></AvatarFallback>
                                            </Avatar>
                                            
                                            <CardTitle className="text-lg sm:text-2xl">{pb.authStore.model? pb.authStore.model.username: null}</CardTitle>

                                        </CardHeader>

                                        <CardFooter>
                                            <Button onClick={()=>{goToMyAccount(), setMenuOpen(!menuOpen)}}>Vai al tuo profilo</Button>
                                        </CardFooter>

                                    </Card>

                                :
                                    <div className="flex border-none shadow-none justify-center items-center flex-col">
                                        <Button onClick={()=>{router.push('/'), setMenuOpen(!menuOpen)}}>Accedi al tuo account</Button>     
                                    </div>
        
                            }
                            
                        </SheetContent>
                    </Sheet>
                </div>

			</div>
		</div>
    )
}