"use client";
import React from "react";
import { UserButton } from "@clerk/clerk-react";
import { ConnectButton } from "../_components/connect-button";
import { AutofillButton } from "../_components/auto-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Users, Settings, FileText } from "lucide-react";

const MainDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <ConnectButton />
            <UserButton />
            <AutofillButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +10% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Canva Integrations
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                2 active, 1 pending
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center justify-between">
                <span>New project created: &quot;Summer Campaign&quot;</span>
                <span className="text-sm text-muted-foreground">
                  2 hours ago
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Canva integration updated</span>
                <span className="text-sm text-muted-foreground">Yesterday</span>
              </li>
              <li className="flex items-center justify-between">
                <span>New team member added: John Doe</span>
                <span className="text-sm text-muted-foreground">
                  2 days ago
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> New Project
          </Button>
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" /> Invite Team Member
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;
