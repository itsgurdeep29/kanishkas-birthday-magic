import { createFileRoute } from "@tanstack/react-router";
import BirthdayExperience from "@/components/birthday/BirthdayExperience";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Happy Birthday Kanishka 🎀💗" },
      { name: "description", content: "A magical birthday surprise made just for Kanishka, with love from Tushar." },
    ],
  }),
});

function Index() {
  return <BirthdayExperience />;
}
