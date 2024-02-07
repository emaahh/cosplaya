"use client"
import { Button } from "@/components/ui/button"

import LogSignPage from "../components/Personali/logsignPage"

import Image from 'next/image'

import { useState, useEffect } from 'react';

import PocketBase from 'pocketbase';
const pb = new PocketBase('https://cosplaya.pockethost.io');


export default function Home() {
    

    const [logged, setLogged] = useState(pb.authStore.isValid);

    const updateLoggedStatus = (status) => {
        setLogged(status);
    };



    const logout = () => {
        pb.authStore.clear()
        setLogged(pb.authStore.isValid)
    }

    return (
        <div>
            
            {
                logged?
                    <>
                        <h1>Ciao! {pb.authStore.model.username}</h1>
                        <Button onClick={logout}>Esci</Button>
                    </>
                :
                    <LogSignPage updateLoggedStatus={updateLoggedStatus}/>
            }

        </div>
    )
}
