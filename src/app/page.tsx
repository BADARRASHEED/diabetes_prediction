"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type FormData = {
  pregnancies: string;
  glucose: string;
  bloodPressure: string;
  skinThickness: string;
  insulin: string;
  bmi: string;
  dpf: string;
  age: string;
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    dpf: "",
    age: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [predictionResult, setPredictionResult] = useState("");
  const [isHappy, setIsHappy] = useState(false);

  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/diabetes_prediction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Pregnancies: parseInt(formData.pregnancies),
            Glucose: parseInt(formData.glucose),
            BloodPressure: parseInt(formData.bloodPressure),
            SkinThickness: parseInt(formData.skinThickness),
            Insulin: parseInt(formData.insulin),
            BMI: parseFloat(formData.bmi),
            DiabetesPedigreeFunction: parseFloat(formData.dpf),
            Age: parseInt(formData.age),
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setPredictionResult(result.result);

        if (result.result === "The person is not Diabetic") {
          setIsHappy(true);
        } else {
          setIsHappy(false);
        }

        setModalOpen(true);
      } else {
        toast({
          title: "Error",
          description: "Failed to get prediction.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
      <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl max-w-5xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-teal-600">
          Diabetes Prediction
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-8 items-center"
        >
          {Object.keys(formData).map((field) => (
            <div key={field} className="flex flex-col space-y-2">
              <label
                htmlFor={field}
                className="text-lg font-medium text-gray-800 capitalize"
              >
                {field}
              </label>
              <Input
                id={field}
                name={field}
                type={field === "bmi" || field === "dpf" ? "number" : "text"}
                placeholder={`Enter ${field}`}
                required
                value={formData[field as keyof FormData]}
                onChange={handleChange}
                className="p-3 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          ))}
          <div className="col-span-2">
            <Button
              type="submit"
              className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xl"
            >
              Predict
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle
              className={isHappy ? "text-green-500" : "text-red-500"}
            >
              {isHappy ? "No Diabetes Detected 🎉" : "Diabetes Detected 😟"}
            </DialogTitle>
          </DialogHeader>
          <p className="mt-4 text-gray-700 text-lg">{predictionResult}</p>
          <Button onClick={() => setModalOpen(false)} className="mt-6">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
