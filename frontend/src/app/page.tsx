"use client";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/context/AppContext";

const Home = () => {
  const { loading } = useAppData();
  return <div>{loading ? <Loading /> : <Button>Test</Button>}</div>;
};

export default Home;
