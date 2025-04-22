"use client";

import { useState } from "react";
import { BookingsList } from "./bookings-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { PaymentsList } from "./payments-list";


type DashboardTabsProps = {
  userId: string;
};

export function DashboardTabs({ userId }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("bookings");
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6 grid w-full grid-cols-2">
        <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        <TabsTrigger value="payments">Payment History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="bookings">
        <BookingsList userId={userId} />
      </TabsContent>
      
      <TabsContent value="payments">
        <PaymentsList userId={userId} />
      </TabsContent>
    </Tabs>
  );
}
