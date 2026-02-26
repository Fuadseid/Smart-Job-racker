"use client";

import Applications from "@/pagecomponents/Applications";
import Dashboard from "@/pagecomponents/Dashboard";
import Router from "next/router";

const pages = {
  applications: {
    url: "/applications",
    component: Applications,
  },
};

function index() {
  return (
    <div>
      <Dashboard>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3 w-full">
          <div className="bg-muted/50 aspect-video rounded-xl w-full" />
          <div className="bg-muted/50 aspect-video rounded-xl w-full" />
          <div className="bg-muted/50 aspect-video rounded-xl w-full" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min w-full" />
      </Dashboard>
    </div>
  );
}

export default index;
