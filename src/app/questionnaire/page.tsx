"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import districts from "../../data/districts";

export default function Questionnaire() {
  const router = useRouter();
  const [form, setForm] = useState({
    speakerName: "",
    language: "",
    gender: "",
    district: "",
    ageGroup: "",
  });

  const [filteredDistricts, setFilteredDistricts] = useState(districts);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDistrictInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setForm({ ...form, district: input });

    const filtered = districts.filter((district) =>
      district.toLowerCase().startsWith(input.toLowerCase())
    );
    setFilteredDistricts(filtered.length ? filtered : districts);
  };

  const handleDistrictSelect = (district: string) => {
    setForm({ ...form, district });
    setShowDropdown(false); // Hide dropdown after selection
  };

  const validateNickname = async () => {
    const response = await fetch("/names.txt");
    const text = await response.text();
    const names = text.split("\n").map((name) => name.trim());
    return !names.includes(form.speakerName);
  };

  const appendNickname = async () => {
    try {
      const response = await fetch("/api/nickname", {
        method: "POST",
        body: JSON.stringify({ nickname: form.speakerName }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save nickname");
      }
    } catch (error) {
      console.error("Error saving nickname:", error);
      setError("Failed to save nickname. Please try again.");
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate speaker name
    if (
      form.speakerName.length < 1 ||
      form.speakerName.length > 7 ||
      !/^[a-zA-Z]+$/.test(form.speakerName)
    ) {
      setError("Speaker name must be 1-7 alphabetic characters.");
      return;
    }

    // Check if nickname is available and save it
    const isNameAvailable = await validateNickname();
    if (!isNameAvailable) {
      setError("Speaker name already taken. Please choose a different one.");
      return;
    }

    await appendNickname();

    // Save form data to sessionStorage
    sessionStorage.setItem("userDetails", JSON.stringify(form));
    router.push("/record");
  };


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white shadow-md rounded-lg w-full max-w-md text-black">
        {error && <p className="text-red-500">{error}</p>}

        {/* Speaker Name */}
        <div>
          <label className="block text-sm font-medium">Enter a unique speaker name (1-7 characters):</label>
          <input
            type="text"
            name="speakerName"
            maxLength={7}
            value={form.speakerName}
            onChange={handleChange}
            placeholder="e.g., Anmol1"
            className="block w-full mt-1 p-2 border rounded-lg text-black"
            required
          />
        </div>

        {/* Language Selection */}
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

        {/* Gender Selection */}
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

        {/* District Selection */}
        <div>
          <label className="block text-sm font-medium">District</label>
          <input
            type="text"
            name="district"
            value={form.district}
            onChange={handleDistrictInputChange}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delayed to allow clicks
            placeholder="Type to search (e.g., Jhapa)"
            className="block w-full mt-1 p-2 border rounded-lg text-black"
            required
          />
          {showDropdown && (
            <ul className="border rounded-lg mt-1 bg-white max-h-40 overflow-y-auto absolute z-10">
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
          )}
        </div>

        {/* Age Group Selection */}
        <div>
          <label className="block text-sm font-medium">Age Group</label>
          <select
            name="ageGroup"
            className="block w-full mt-1 p-2 border rounded-lg text-black"
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="kid">below18</option>
            <option value="mid">18-40</option>
            <option value="old">40+</option>
          </select>
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" required />
          <label>I agree to participate</label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">
          Next
        </button>
      </form>
    </main>
  );
}
