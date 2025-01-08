"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import districts from "../data/districts";


export default function Questionnaire() {
  const router = useRouter();
  const [form, setForm] = useState({
    language: "",
    gender: "",
    district: "",
    ageGroup: "",
  });

  const [filteredDistricts, setFilteredDistricts] = useState(districts);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDistrictInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setForm({ ...form, district: input });

    // Filter districts
    const filtered = districts.filter((district) =>
      district.toLowerCase().startsWith(input.toLowerCase())
    );
    setFilteredDistricts(filtered.length ? filtered : districts);
  };

  const handleDistrictSelect = (district: string) => {
    setForm({ ...form, district });
    setFilteredDistricts(districts); // Reset the dropdown
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("userDetails", JSON.stringify(form));
    router.push("/record");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow-md rounded-lg w-full max-w-md text-black">
        <div>
          <label className="block text-sm font-medium">What’s your mother tongue?</label>
          <select
            name="language"
            className="block w-full mt-1 p-2 border rounded-lg text-black"
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
            className="block w-full mt-1 p-2 border rounded-lg text-black"
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
            value={form.district}
            onChange={handleDistrictInputChange}
            placeholder="Type to search (e.g., Jhapa)"
            className="block w-full mt-1 p-2 border rounded-lg text-black"
            required
          />
          {/* Dropdown Suggestions */}
          <ul className="border rounded-lg mt-1 bg-white max-h-40 overflow-y-auto">
            {filteredDistricts.map((district) => (
              <li
                key={district}
                onClick={() => handleDistrictSelect(district)}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {district}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label className="block text-sm font-medium">Age Group</label>
          <select
            name="ageGroup"
            className="block w-full mt-1 p-2 border rounded-lg text-black"
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="kid">Below 18</option>
            <option value="mid">Between 18-40</option>
            <option value="old">40+</option>
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
