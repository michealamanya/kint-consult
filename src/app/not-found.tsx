import { Button, Eyebrow } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="not-found">
      <Eyebrow>404 / Page not found</Eyebrow>
      <h1>Let’s find the right direction.</h1>
      <p>
        This page could not be found. Explore KINT’s services, industries and
        intelligence direction from the homepage.
      </p>
      <Button href="/">Return to KINT</Button>
    </section>
  );
}
