import { QuestionnaireForm } from "@/components/forms/questionnaire-form";

export default function QuestionnairePage() {
  return (
    <section className="space-y-4">
      <h1 className="font-heading text-3xl">Questionnaire de validation marché</h1>
      <QuestionnaireForm />
    </section>
  );
}
