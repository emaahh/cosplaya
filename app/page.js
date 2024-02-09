"use client"
import { Button } from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"


import { Upload } from 'lucide-react';
import { LoaderIcon } from "lucide-react"


import LogSignPage from "../components/Personali/logsignPage"

import Image from 'next/image'

import { useState, useEffect } from 'react';

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://cosplaya.pockethost.io');


export default function Home() {

    const { toast } = useToast()

    const [logged, setLogged] = useState(pb.authStore.isValid);


    const updateLoggedStatus = (status) => {
        setLogged(status);
        if(status && pb.authStore.model){
            setAvatar(`https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`);
        }
    };


    const logout = () => {
        pb.authStore.clear()
        setLogged(pb.authStore.isValid)
    }

    const [avatar, setAvatar] = useState();
    useEffect(() => {
        if (pb.authStore.model) {
            setAvatar(`https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`);
        }
    }, []);
    
    

    return (
        <div>
            
            {
                logged?
                    <h1>Loggato come: {pb.authStore.model.username}</h1>
                :
                    <LogSignPage updateLoggedStatus={updateLoggedStatus}/>
            }

        </div>
    )
}
