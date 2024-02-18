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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  LoaderIcon,
  Heart,
  MessageCircleMore,
  Pin,
  Maximize2,
} from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import chroma from "chroma-js";

import { useState, useEffect } from "react";

import PocketBase from "pocketbase";

const pb = new PocketBase("https://cosplaya.pockethost.io");

export default function Post({ id, foto, descrizione, autore, timestamp }) {
  const router = useRouter();

  const { toast } = useToast();

  const [logged, setLogged] = useState(pb.authStore.isValid);
  const [colore, setColore] = useState("#000");
  const [largeFoto, setLargeFoto] = useState(false);

  const adjustColor =
    chroma(colore).luminance() < 0.025
      ? chroma(colore).brighten(4)
      : chroma(colore).darken();

  return (
    <>
      <Dialog open={largeFoto} onOpenChange={setLargeFoto} className="rounded">
        <DialogContent className="rounded">
          <DialogHeader>
            <DialogTitle>Preview post</DialogTitle>
            <DialogDescription>
              <img
                className=" w-full self-center rounded  object-contain"
                src="https://i.pinimg.com/736x/99/4e/8c/994e8c6c41cb42597b63f0f2387e1794.jpg"
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Card className="mb-5  overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between align-middle">
          <div className="inline-flex flex-row items-center">
            <Avatar className="z-0 mr-2 flex items-center justify-center">
              <AvatarImage
                src={
                  autore.avatar
                    ? "https://cosplaya.pockethost.io/api/files/users/" +
                      autore.id +
                      "/" +
                      autore.avatar
                    : "https://github.com/shadcn.png"
                }
                className="aspect-auto max-w-none object-cover"
              />
              <AvatarFallback>
                <LoaderIcon className="animate-spin" />
              </AvatarFallback>
            </Avatar>
            <CardDescription className="underline">
              <Link href={"/account/" + autore.username}>
                @{autore.username}
              </Link>
            </CardDescription>
          </div>

          <CardDescription className="italic opacity-50">
            {timestamp}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {foto.length > 0 && (
            <Carousel className="w-[95%] max-w-[550px] sm:w-[80%]">
              <CarouselContent>
                {foto?.map((item) => (
                  <CarouselItem className="flex rounded align-middle">
                    <img
                      className=" max-h-[500px] w-full max-w-[500px] self-center rounded  object-contain"
                      src={
                        "https://cosplaya.pockethost.io/api/files/posts/" +
                        id +
                        "/" +
                        item
                      }
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
              <div className="absolute bottom-5 flex w-full items-center justify-center">
                <Button
                  adjustColor="rgb(100, 116, 139)"
                  className="h-10 w-10 border-spacing-1 rounded-full border-slate-500 p-3 opacity-50 sm:h-12 sm:w-12"
                  onClick={() => setLargeFoto(true)}
                >
                  <Maximize2 className="bg-[transparent!important]" />
                </Button>
              </div>
            </Carousel>
          )}
        </CardContent>
        <CardContent className="inline-flex flex-row align-middle">
          <Heart className="mr-3" />
          <MessageCircleMore className="mr-3" />
          <Pin className="mr-3" />
        </CardContent>
        <CardFooter className=" max-w-screen-sm">
          <p className="text-justify text-xs sm:text-sm">{descrizione}</p>
        </CardFooter>
      </Card>
    </>
  );
}
