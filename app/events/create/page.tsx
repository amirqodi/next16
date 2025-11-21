import EventForm from "@/components/events/EventForm";

export default function CreateEventPage() {
  return (
    <main>
      <h1>Create New Event</h1>

      <div className="mt-10 glass p-10 rounded-xl">
        <EventForm />
      </div>
    </main>
  );
}
