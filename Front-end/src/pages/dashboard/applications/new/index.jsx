"use client";

import Dashboard from "@/pagecomponents/Dashboard";
import { useCreateJobsMutation } from "@/store/apiSlice";
import { useRouter } from "next/router";
import { useState } from "react";
import { 
  Briefcase, 
  MapPin, 
  DollarSign,
  ArrowLeft,
  Loader2,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useSelector } from "react-redux";

function AddNewApplication() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [createJob, { isLoading }] = useCreateJobsMutation();
  
  // Form state
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    jobUrl: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
    status: "applied",
    resumeVersion: "",
    appliedDate: new Date().toISOString().split('T')[0],
    followUpDate: "",
    notes: "",
    source: "manual"
  });

  // Handle form changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createJob({
        userId: user?.id,
        ...formData,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
      }).unwrap();

      toast.success("Application created successfully!");
      
      setTimeout(() => {
        router.push("/dashboard/applications");
      }, 1500);
      
    } catch (error) {
      console.error("Failed to create job:", error);
      toast.error("Failed to create application. Please try again.");
    }
  };

  return (
    <Dashboard>
      <Toaster position="top-right" richColors />
      
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-all duration-300 mb-4"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Applications
            </button>
            
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
                <Briefcase className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Add New Application</h1>
                <p className="text-slate-400 text-sm mt-1">Track and manage your job applications effortlessly</p>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
            <CardHeader className="border-b border-slate-700/50 pb-6">
              <CardTitle className="text-xl text-white">Application Details</CardTitle>
              <CardDescription className="text-slate-400">
                Fill in the information about your job application
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Section 1: Company & Position */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <div className="h-1 w-1 bg-cyan-400 rounded-full"></div>
                    Job Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-slate-200 text-sm font-medium">
                        Company Name <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Tech Corp"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-slate-200 text-sm font-medium">
                        Position <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="position"
                        value={formData.position}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Frontend Developer"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobUrl" className="text-slate-200 text-sm font-medium">
                      Job URL
                    </Label>
                    <Input
                      id="jobUrl"
                      type="url"
                      value={formData.jobUrl}
                      onChange={handleChange}
                      placeholder="https://company.com/job"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                    />
                  </div>
                </div>

                {/* Section 2: Location & Salary */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <div className="h-1 w-1 bg-blue-400 rounded-full"></div>
                    Location & Compensation
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-slate-200 text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Addis Ababa"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resumeVersion" className="text-slate-200 text-sm font-medium">
                        Resume Version
                      </Label>
                      <Input
                        id="resumeVersion"
                        value={formData.resumeVersion}
                        onChange={handleChange}
                        placeholder="v1"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salaryMin" className="text-slate-200 text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        Salary Min
                      </Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={formData.salaryMin}
                        onChange={handleChange}
                        placeholder="1000"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-green-400 focus:ring-green-400/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="salaryMax" className="text-slate-200 text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        Salary Max
                      </Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        value={formData.salaryMax}
                        onChange={handleChange}
                        placeholder="2000"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-green-400 focus:ring-green-400/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Status & Dates */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <div className="h-1 w-1 bg-purple-400 rounded-full"></div>
                    Status & Timeline
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-slate-200 text-sm font-medium">
                        Application Status
                      </Label>
                      <Select value={formData.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-400 focus:ring-purple-400/20">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="applied" className="cursor-pointer hover:bg-slate-600">Applied</SelectItem>
                          <SelectItem value="interview" className="cursor-pointer hover:bg-slate-600">Interview</SelectItem>
                          <SelectItem value="offer" className="cursor-pointer hover:bg-slate-600">Offer</SelectItem>
                          <SelectItem value="rejected" className="cursor-pointer hover:bg-slate-600">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="appliedDate" className="text-slate-200 text-sm font-medium">
                        Applied Date <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="appliedDate"
                        type="date"
                        value={formData.appliedDate}
                        onChange={handleChange}
                        required
                        className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="followUpDate" className="text-slate-200 text-sm font-medium">
                      Follow-up Date
                    </Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      value={formData.followUpDate}
                      onChange={handleChange}
                      className="bg-slate-700/50 border-slate-600 text-white focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  </div>
                </div>

                {/* Section 4: Notes */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide flex items-center gap-2">
                    <div className="h-1 w-1 bg-amber-400 rounded-full"></div>
                    Additional Notes
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-slate-200 text-sm font-medium">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Add any notes about your application, interview details, or follow-up reminders..."
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20 resize-none"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-6 border-t border-slate-700/50">
                  <Button
                    type="button"
                    onClick={() => router.back()}
                    variant="outline"
                    className="flex-1 border-slate-600 hover:bg-slate-700 hover:text-white cursor-pointer text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 cursor-pointer hover:from-cyan-600 hover:to-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Application
                      </>
                    )}
                  </Button>
                </div>

                {/* Required Fields Note */}
                <p className="text-slate-400 text-xs text-center">
                  Fields marked with <span className="text-red-400 font-semibold">*</span> are required
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Dashboard>
  );
}

export default AddNewApplication;
