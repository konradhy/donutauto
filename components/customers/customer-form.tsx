// components/customers/customer-form.tsx
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export function CustomerForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [instagramHandle, setInstagramHandle] = useState("");
  const [tiktokHandle, setTiktokHandle] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");

  const addCustomer = useMutation(api.customers.add);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      toast.warning(
        "Hold the sprinkles! 🧁 Are you sure all the required details are filled?",
        {
          style: {
            background: "#F59E0B",
            color: "white",
            border: "2px solid #B45309",
            borderRadius: "8px",
          },
          duration: 4000,
        },
      );
      return false;
    }

    void handleSubmitAsync();
  };

  const handleSubmitAsync = async () => {
    try {
      await addCustomer({
        firstName,
        lastName,
        email,
        phone,
        dob,
        preferences,
        instagramHandle,
        tiktokHandle,
        twitterHandle,
      });
      toast.success("Sweet success! 🍩 New customer glazed and ready to go!", {
        style: {
          background: "#10B981",
          color: "white",
          border: "2px solid #047857",
          borderRadius: "8px",
        },
        duration: 4000,
      });
      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setDob("");
      setPreferences([]);
      setInstagramHandle("");
      setTiktokHandle("");
      setTwitterHandle("");
    } catch (error) {
      toast.error("Failed to add customer. Please try again.", {
        style: { background: "#EF4444", color: "white" },
      });
      toast.error(
        "Oops! We've got a hole in our donut. 🕳️ Let's try adding that customer again!",
        {
          style: {
            background: "#EF4444",
            color: "white",
            border: "2px solid #B91C1C",
            borderRadius: "8px",
          },
          duration: 5000,
        },
      );
      console.error("Failed to add customer:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 dark:from-pink-900 dark:via-purple-900 dark:to-indigo-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 bg-opacity-20 dark:bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-1">
            Sprinkle in a New Customer 🍩
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
            Fill in the sweet details below!
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                  placeholder="Glazed Gloria"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                  placeholder="Doughnut"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                placeholder="glazed.gloria@sweetemails.com"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                placeholder="(555) DONUT-YUM"
              />
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
              />
            </div>
            <div>
              <label
                htmlFor="instagramHandle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Instagram Handle
              </label>
              <input
                type="text"
                id="instagramHandle"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                placeholder="@donut_queen_gloria"
              />
            </div>
            <div>
              <label
                htmlFor="tiktokHandle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                TikTok Handle
              </label>
              <input
                type="text"
                id="tiktokHandle"
                value={tiktokHandle}
                onChange={(e) => setTiktokHandle(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                placeholder="@glazed_and_confused"
              />
            </div>
            <div>
              <label
                htmlFor="twitterHandle"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Twitter Handle
              </label>
              <input
                type="text"
                id="twitterHandle"
                value={twitterHandle}
                onChange={(e) => setTwitterHandle(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                placeholder="@sprinkle_thoughts"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            >
              Add Customer 🎉
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
