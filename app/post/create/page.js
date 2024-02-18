"use client";
import { Button } from "@/components/Personali/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ToastAction } from "@/components/ui/toast";

import Post from "@/components/Personali/postComponent";

import {
  LoaderIcon,
  Heart,
  MessageCircleMore,
  Pin,
  Maximize2,
  Upload,
} from "lucide-react";

import { useMediaQuery } from "react-responsive";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import chroma from "chroma-js";
import { Colorful } from "@uiw/react-color";

import { useState, useEffect, useRef } from "react";

import PocketBase from "pocketbase";

const pb = new PocketBase("https://cosplaya.pockethost.io");

export default function Home() {
  const router = useRouter();

  const { toast } = useToast();

  const [logged, setLogged] = useState(pb.authStore.isValid);
  const [colore, setColore] = useState("#fff");
  const [fotoUploaded, setFotoUploaded] = useState();
  const [descrizione, setDescrizione] = useState("");

  const adjustColor =
    chroma(colore).luminance() < 0.025
      ? chroma(colore).brighten(4)
      : chroma(colore).darken();

  useEffect(() => {
    if (!logged) {
      router.push("/account/loginregister");
    }
  }, []);

  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  const inputFotoRef = useRef(null);
  const handleUploadFotoClick = () => {
    inputFotoRef.current.click();
  };

  const handleFotoChange = async (e) => {
    if (e.target.files) {
      console.log("preso in carico");
      setFotoUploaded([...e.target.files]);
      console.log(fotoUploaded[0].name);
    }
  };

  const pubblicaPost = async () => {
    try {
      const formData = new FormData();
      formData.append("descrizione", descrizione);
      formData.append("autore", pb.authStore.model.id);
      if (fotoUploaded != undefined) {
        for (let foto of fotoUploaded) {
          formData.append("fotos", foto);
        }
      }
      const record = await pb.collection("posts").create(formData);
      toast({
        title: "Post caricato correttamente.",
        action: (
          <ToastAction
            altText="Torna alla home"
            onClick={() => router.push("/")}
          >
            Torna alla home.
          </ToastAction>
        ),
      });
    } catch (e) {
      toast({
        title: "Non è stato possibile caricare il post.",
        description: "Riprova tra qualche secondo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div style={{ backgroundColor: chroma(colore).brighten(2.5) }}>
      <div className="mx-auto flex max-w-sm translate-y-1/4 flex-col justify-center space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-lg font-bold sm:text-3xl">Cosa c'è di nuovo?</h1>
        </div>
      </div>

      <div className="container">
        <Card className="mt-[60px] w-full overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between align-middle">
            <h4 className="font-bold "></h4>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {!fotoUploaded ? (
              <Button
                className="mb-5 inline-flex max-w-[500px] items-center border-dashed"
                variant="outline"
                adjustColor={"gray"}
                onClick={handleUploadFotoClick}
              >
                <input
                  multiple
                  ref={inputFotoRef}
                  className="hidden"
                  id="file-upload"
                  type="file"
                  onChange={handleFotoChange}
                />
                <Upload className="bg-[transparent!important] p-1" /> Aggiungi
                una o più immagini
              </Button>
            ) : (
              <Button
                className="mb-5 inline-flex max-w-[500px] items-center border-dashed"
                variant="outline"
                adjustColor={"red"}
                onClick={() => setFotoUploaded()}
              >
                Rimuovi immagini
              </Button>
            )}

            <Carousel className="w-[90%] max-w-[400px] sm:w-[70%]">
              <CarouselContent>
                {fotoUploaded &&
                  fotoUploaded.map((foto, i) => (
                    <CarouselItem className="flex rounded align-middle">
                      <img
                        className=" max-h-[500px] w-full self-center rounded  object-contain"
                        src={URL.createObjectURL(foto)}
                      />
                    </CarouselItem>
                  ))}
              </CarouselContent>
              {fotoUploaded && fotoUploaded.length > 1 && (
                <>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </>
              )}
            </Carousel>

            <br />

            <Textarea
              placeholder="Aggiungi una descrizione al tuo post."
              value={descrizione}
              onChange={(e) => setDescrizione(e.target.value)}
            />

            <br />

            <Button
              className="mb-5 inline-flex max-w-[500px] items-center border-dashed"
              variant="outline"
              adjustColor={"black"}
              onClick={() => {
                descrizione != "" || fotoUploaded != undefined
                  ? pubblicaPost()
                  : toast({
                      title: "Non puoi pubblicare post al momento.",
                      description:
                        "Carica almeno una foto o aggiungi almeno una descrizione.",
                      variant: "destructive",
                    });
              }}
            >
              Pubblica
            </Button>
          </CardContent>
        </Card>
      </div>

      <br />
      <br />
    </div>
  );
}
