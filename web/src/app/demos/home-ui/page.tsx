import { redirect } from "next/navigation";

/** Design preview URL; production flow uses `/consult/welcome`. */
export default function HomeUiDemoRedirect() {
  redirect("/consult/welcome");
}
