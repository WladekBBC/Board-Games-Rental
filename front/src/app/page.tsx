"use client";

import { useLang } from "@/contexts/LanguageContext";
import HomeUserPanel from "@/components/HomePage/HomeUserPanel";
import GameList from "@/components/HomePage/GameList";
import { Spinner } from "@/components/Messages/Spinner";
import { useLoading } from "@/contexts/LoadingContext";

/**
 * Home page
 * @returns {React.ReactNode}
 */
export default function Home() {
  const { language } = useLang();
  const { loading } = useLoading();

  if (!loading)
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{language.appTitle}</h1>
        <HomeUserPanel />
        <GameList />
      </main>
    );
  return <Spinner />;
}
