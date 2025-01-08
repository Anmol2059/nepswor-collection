"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import districts from "../../data/districts";

export default function Questionnaire() {
  const router = useRouter();
  const [form, setForm] = useState({
    language: "",
    gender: "",
    district: "",
    ageGroup: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const suggestions = districts.filter((district) =>
      district.toLowerCase().startsWith(input.toLowerCase())
    );
    setForm({ ...form, district: suggestions[0] || input });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("userDetails", JSON.stringify(form)); // Save details to session storage
    router.push("/record");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow-md rounded-lg w-full max-w-md">
        <div>
          <label className="block text-sm font-medium">What’s your mother tongue?</label>
          <select
            name="language"
            className="block w-full mt-1 p-2 border rounded-lg"
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Nepali">Nepali</option>
            <option value="Maithili">Maithili</option>
            <option value="Bhojpuri">Bhojpuri</option>
            <option value="Tharu">Tharu</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Gender</label>
          <select
            name="gender"
            className="block w-full mt-1 p-2 border rounded-lg"
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">District</label>
          <input
            type="text"
            name="district"
            className="block w-full mt-1 p-2 border rounded-lg"
            onChange={handleDistrictChange}
            value={form.district}
            placeholder="Type to search (e.g., Jhapa)"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Age Group</label>
          <select
            name="ageGroup"
            className="block w-full mt-1 p-2 border rounded-lg"
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="below 18">Below 18</option>
            <option value="18-40">18-40</option>
            <option value="40+">40+</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" required />
          <label>I agree to participate</label>
        </div>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
          Next
        </button>
      </form>
    </main>
  );
}
