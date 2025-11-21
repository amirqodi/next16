"use client";

import Image from "next/image";
import { useState } from "react";

export default function EventForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    overview: "",
    venue: "",
    location: "",
    date: "",
    time: "",
    mode: "offline",
    audience: "",
    organizer: "",
    agenda: "",
    tags: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const fd = new FormData();

    // append text fields
    Object.entries(form).forEach(([key, value]) => {
      if (key === "agenda" || key === "tags") {
        // send as JSON string
        fd.append(key, JSON.stringify(value.split(",").map((i) => i.trim())));
      } else {
        fd.append(key, value);
      }
    });

    // append image
    if (imageFile) {
      fd.append("image", imageFile);
    }

    // optional: debug
    for (const [key, value] of fd.entries()) {
      if (value instanceof File) {
        console.log(key, value.name, value.size, value.type);
      } else {
        console.log(key, value);
      }
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: fd, // ← MUST be FormData
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("🎉 Event created successfully!");
        setForm({
          title: "",
          description: "",
          overview: "",
          venue: "",
          location: "",
          date: "",
          time: "",
          mode: "offline",
          audience: "",
          organizer: "",
          agenda: "",
          tags: "",
        });
        setImageFile(null);
        setImagePreview(null);
      } else {
        setMessage(data.message || "Failed to create event");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* IMAGE UPLOADER */}
      <div className="flex flex-col gap-2">
        <label>Image</label>

        <label className="glass flex flex-col items-center justify-center w-full h-40 cursor-pointer border border-border-dark rounded-lg">
          <span className="text-light-100">
            {imageFile ? "Change Image" : "Upload Image"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
        </label>

        {imagePreview && (
          <Image
            src={imagePreview}
            className="w-full object-cover rounded-lg mt-2"
            alt="image preview"
            width={500}
            height={300}
          />
        )}
      </div>

      <Input
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
      />

      <div className="flex flex-col gap-2">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="bg-dark-200 rounded-md px-5 py-3"
          rows={3}
        />
      </div>

      <Input
        label="Overview"
        name="overview"
        value={form.overview}
        onChange={handleChange}
      />
      <Input
        label="Venue"
        name="venue"
        value={form.venue}
        onChange={handleChange}
      />
      <Input
        label="Location"
        name="location"
        value={form.location}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="Date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
        <Input
          type="time"
          label="Time"
          name="time"
          value={form.time}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label>Mode</label>
        <select
          name="mode"
          value={form.mode}
          onChange={handleChange}
          className="bg-dark-200 rounded-md px-5 py-2.5"
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <Input
        label="Audience"
        name="audience"
        value={form.audience}
        onChange={handleChange}
      />
      <Input
        label="Organizer"
        name="organizer"
        value={form.organizer}
        onChange={handleChange}
      />

      <Input
        label="Agenda (comma-separated)"
        name="agenda"
        value={form.agenda}
        onChange={handleChange}
      />

      <Input
        label="Tags (comma-separated)"
        name="tags"
        value={form.tags}
        onChange={handleChange}
      />

      <button
        disabled={loading}
        className="bg-primary hover:bg-primary/90 rounded-md px-5 py-3 text-black font-semibold"
      >
        {loading ? "Creating..." : "Create Event"}
      </button>

      {message && (
        <p className="text-light-100 text-lg font-semibold mt-3">{message}</p>
      )}
    </form>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Input({ label, name, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <input
        name={name}
        className="bg-dark-200 rounded-md px-5 py-2.5"
        {...props}
      />
    </div>
  );
}
