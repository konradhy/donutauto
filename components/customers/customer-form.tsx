// components/customers/customer-form.tsx
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CustomerForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);

  const addCustomer = useMutation(api.customers.add);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCustomer({
        firstName,
        lastName,
        email,
        phone,
        dob,
        preferences,
      });
      toast.success("Customer added successfully!", {
        style: { background: "#10B981", color: "white" },
      });
      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDob("");
      setPreferences([]);
    } catch (error) {
      toast.error("Failed to add customer. Please try again.", {
        style: { background: "#EF4444", color: "white" },
      });
      console.error("Failed to add customer:", error);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-pink-100 via-yellow-100 to-blue-100 dark:from-pink-900 dark:via-yellow-900 dark:to-blue-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
          Sprinkle in a New Customer 🍩
        </CardTitle>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Fill in the sweet details below!
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="John"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Dough"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="(123) 456-7890"
            />
          </div>
          <div>
            <label
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {/* Add preferences input here */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-pink-500 hover:from-blue-600 hover:to-pink-600 text-white font-bold rounded-md transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg"
          >
            Add Customer 🎉
          </button>
        </form>
      </CardContent>
    </Card>
  );
}

/*
I do not like how this looks. Mainly because it looks like a colourful card on a white background. That doesn't look good. 
If you want to do that then we can make it so the card looks more prominent on the page. But right now the syling is awkward. 
We can use the card but give colour to the background and give it a type of blur. Also be more unique with the gradient blur. 
Improve the styling some more to make it more modern. Give better padding for the text in the forms as well. 

I was building in feature/dashboard. Pushed it to github. I did not merve. Then moved out to customer form. but did not use checkout or anything. 
I made some changes then pressed commit. I realize this is a mistake. I should have merged the feature/dashboard first. then checkout to customer form. 

How do I correct this. Do you need to ask any clarifying questions?
What should i do? Give me a step by step plan. And then give me the code to follow. Perhaps i should simply 


I might have to move lib, canva api into the convex folder. I don't think convex can access things not inside the convex folder. 
But let's first see if i can get it working use fetch calls. 

*/
