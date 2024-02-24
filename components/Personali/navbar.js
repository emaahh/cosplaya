"use client";
import { useState, useEffect } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/Personali/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import chroma from "chroma-js";

import { LoaderIcon, Menu, X } from "lucide-react";

import Fade from "@mui/material/Fade";

import Link from "next/link";
import { useRouter } from "next/navigation";

import PocketBase from "pocketbase";
import { rgb } from "chroma-js";
const pb = new PocketBase("https://cosplaya.pockethost.io");

export default function Navbar() {
  const router = useRouter();

  const [logged, setLogged] = useState(pb.authStore.isValid);
  const [colore, setColore] = useState("white");
  const [menuOpen, setMenuOpen] = useState(false);
  const [show, setShow] = useState(false);

  const controlNavbar = () => {
    if (window.scrollY > 100) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const adjustColor =
    chroma(colore).luminance() < 0.025
      ? chroma(colore).brighten(4)
      : chroma(colore).darken();

  const [avatar, setAvatar] = useState();
  const updateLog = () => {
    setLogged(pb.authStore.isValid);
    if (pb.authStore.model) {
      if (pb.authStore.model.avatar) {
        setAvatar(
          `https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`,
        );
      } else {
        setAvatar(
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
        );
      }
    }
  };
  useEffect(() => {
    if (pb.authStore.model) {
      if (pb.authStore.model.avatar) {
        setAvatar(
          `https://cosplaya.pockethost.io/api/files/users/${pb.authStore.model.id}/${pb.authStore.model.avatar}`,
        );
      } else {
        setAvatar(
          "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
        );
      }
    }

    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [logged]);

  const goToMyAccount = () => {
    if (pb.authStore.model) {
      router.push("/account/" + pb.authStore.model.username);
    }
  };

  return (
    <div className="h-28">
      <div
        className={`fixed z-10 inline-flex w-screen flex-col items-center justify-center align-middle backdrop-blur`}
        style={{
          backgroundImage: `linear-gradient(180deg, ${chroma(colore).alpha(0.25)}, transparent)`,
        }}
      >
        <div className="inline-flex flex-col items-center align-middle">
          <h1
            className="pt-5 text-3xl font-bold sm:text-4xl md:text-5xl "
            style={{ fontFamily: "huglove" }}
          >
            CosPlaya
          </h1>
          <p
            className={`pb-5 text-xs text-gray-500 transition-all ease-in sm:text-sm dark:text-gray-400 ${show && "opacity-0"}`}
          >
            Più di un social, una famiglia.
          </p>
        </div>

        <div className="fixed right-0 pr-5">
          <Sheet open={menuOpen}>
            <button
              onClick={() => {
                setMenuOpen(!menuOpen), updateLog();
              }}
            >
              <Menu />
            </button>
            <SheetContent>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setMenuOpen(!menuOpen), updateLog();
                  }}
                >
                  <X />
                </button>
              </div>
              {logged ? (
                <Card className="flex flex-col items-center justify-center border-none shadow-none">
                  <CardHeader className="items-center">
                    <Avatar className="flex h-20 w-20 items-center justify-center">
                      <AvatarImage
                        src={avatar}
                        className="aspect-auto max-w-none object-cover"
                      />
                      <AvatarFallback>
                        <LoaderIcon className="animate-spin" />
                      </AvatarFallback>
                    </Avatar>

                    <CardTitle className="text-lg sm:text-2xl">
                      {pb.authStore.model ? pb.authStore.model.username : null}
                    </CardTitle>
                  </CardHeader>

                  <CardFooter>
                    <Button
                      onClick={() => {
                        goToMyAccount(), setMenuOpen(!menuOpen);
                      }}
                    >
                      Vai al tuo profilo
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="flex flex-col items-center justify-center border-none shadow-none">
                  <Button
                    onClick={() => {
                      router.push("/"), setMenuOpen(!menuOpen);
                    }}
                  >
                    Accedi al tuo account
                  </Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
